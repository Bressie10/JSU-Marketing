<?php
/**
 * followup-cron.php — Daily cron job for quote lead follow-up sequence.
 *
 * Stage 0 → 1: lead created 2+ days ago, not yet contacted → "still interested?" email
 * Stage 1 → 2: last_contacted_at 5+ days ago → final "limited availability" email
 *
 * Cron example (run daily at 09:00):
 *   0 9 * * * php /path/to/followup-cron.php >> /path/to/followup-log.txt 2>&1
 */

$SUPABASE_URL     = 'https://zluprfqjvlelcvoeqpnx.supabase.co';
$SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsdXByZnFqdmxlbGN2b2VxcG54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODExMzQxNCwiZXhwIjoyMDgzNjg5NDE0fQ.eVeZMYiz4E3oUeCpoRvwZtPC5ISLAMc5Fb-V1QumG1U';
$RESEND_KEY       = 're_fmaxR1EW_KoL3dg41x5Yn6HRaCmqL68Kk';
$LOG_FILE         = __DIR__ . '/followup-log.txt';

function cron_log(string $msg): void {
    global $LOG_FILE;
    $line = '[' . date('Y-m-d H:i:s') . '] ' . $msg . PHP_EOL;
    file_put_contents($LOG_FILE, $line, FILE_APPEND);
}

function sb_get(string $table, array $query): ?array {
    global $SUPABASE_URL, $SERVICE_ROLE_KEY;
    $url = $SUPABASE_URL . '/rest/v1/' . $table . '?' . http_build_query($query);
    $ch  = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $SERVICE_ROLE_KEY,
            'apikey: ' . $SERVICE_ROLE_KEY,
        ],
    ]);
    $body   = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($status !== 200 || $body === false) {
        cron_log("sb_get ERROR — table=$table status=$status body=" . ($body ?: 'curl_error'));
        return null;
    }
    return json_decode($body, true) ?: [];
}

function sb_patch(string $table, string $id, array $data): bool {
    global $SUPABASE_URL, $SERVICE_ROLE_KEY;
    $url = $SUPABASE_URL . '/rest/v1/' . $table . '?id=eq.' . urlencode($id);
    $ch  = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => 'PATCH',
        CURLOPT_POSTFIELDS     => json_encode($data),
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $SERVICE_ROLE_KEY,
            'apikey: ' . $SERVICE_ROLE_KEY,
            'Content-Type: application/json',
            'Prefer: return=minimal',
        ],
    ]);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_exec($ch);
    curl_close($ch);
    return $status >= 200 && $status < 300;
}

function send_followup_email(string $to, string $subject, string $html): bool {
    global $RESEND_KEY;
    $payload = [
        'from'    => 'JSU Marketing <noreply@jsumarketing.com>',
        'to'      => [$to],
        'subject' => $subject,
        'html'    => $html,
        'reply_to'=> ['jsumarketingteam@gmail.com'],
    ];
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $RESEND_KEY,
            'Content-Type: application/json',
        ],
    ]);
    curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $status === 200 || $status === 201;
}

function features_html(array $features): string {
    $out = '';
    foreach ($features as $f) {
        $out .= "<li style='padding:4px 0;border-bottom:1px solid #eee;'>&#10003; " . htmlspecialchars($f) . "</li>";
    }
    return $out;
}

function package_summary_html(array $lead): string {
    $web  = is_array($lead['website_features']) ? $lead['website_features'] : [];
    $soc  = is_array($lead['social_features'])  ? $lead['social_features']  : [];
    return "
        <div style='margin-bottom:20px;'>
            <div style='font-weight:bold;border-bottom:2px solid #FFD700;padding-bottom:6px;margin-bottom:8px;'>Website</div>
            <ul style='list-style:none;padding:0;margin:0;'>" . features_html($web) . "</ul>
        </div>
        <div style='margin-bottom:20px;'>
            <div style='font-weight:bold;border-bottom:2px solid #FFD700;padding-bottom:6px;margin-bottom:8px;'>Social Media</div>
            <ul style='list-style:none;padding:0;margin:0;'>" . features_html($soc) . "</ul>
        </div>";
}

$email_styles = "body{font-family:Arial,sans-serif;line-height:1.6;color:#333;}
    .container{max-width:600px;margin:0 auto;padding:20px;}
    .header{background:linear-gradient(135deg,#FFD700 0%,#d97706 100%);color:#000;padding:20px;border-radius:8px 8px 0 0;text-align:center;}
    .content{background:#f9f9f9;padding:20px;border:1px solid #ddd;}
    .contact-box{background:#fff;border-left:4px solid #FFD700;padding:14px 18px;margin:20px 0;border-radius:0 6px 6px 0;}
    .footer{background:#f0f0f0;padding:15px;border-radius:0 0 8px 8px;font-size:12px;color:#999;text-align:center;}";

$now         = gmdate('Y-m-d\TH:i:s\Z');
$two_days_ago  = gmdate('Y-m-d\TH:i:s\Z', strtotime('-2 days'));
$five_days_ago = gmdate('Y-m-d\TH:i:s\Z', strtotime('-5 days'));

cron_log("=== Cron run started ===");

// -----------------------------------------------------------------------
// Stage 0 → 1: created 2+ days ago, not yet followed up
// -----------------------------------------------------------------------
$stage0_leads = sb_get('leads', [
    'follow_up_stage' => 'eq.0',
    'created_at'      => 'lte.' . $two_days_ago,
    'select'          => '*',
]);

if ($stage0_leads === null) {
    cron_log("Stage 0 query failed — skipping");
} else {
    cron_log("Stage 0 leads to follow up: " . count($stage0_leads));

    foreach ($stage0_leads as $lead) {
        $name     = htmlspecialchars($lead['name'] ?? 'there');
        $biz_name = htmlspecialchars($lead['business_name'] ?? 'your business');
        $pkg_name = htmlspecialchars($lead['package_name'] ?? 'your package');
        $pkg_html = package_summary_html($lead);

        $subject = "Still thinking it over? Your JSU Marketing quote is waiting";
        $html    = "<!DOCTYPE html><html><head><style>{$email_styles}</style></head><body>
        <div class='container'>
            <div class='header'><h2>We're still here when you're ready</h2></div>
            <div class='content'>
                <p>Hi {$name},</p>
                <p>A couple of days ago you put together a <strong>{$pkg_name}</strong> quote for <strong>{$biz_name}</strong> on our website. We just wanted to check in — are you still interested?</p>
                <p>Here's a reminder of what was included:</p>
                {$pkg_html}
                <p>If you have any questions or want to tweak the package, just reply to this email or give us a call — we're happy to chat through the options with no pressure.</p>
                <div class='contact-box'>
                    <strong>Get in touch:</strong><br>
                    Jack Hayes: <a href='tel:0879449977'>087 944 9977</a><br>
                    Sean Daly: <a href='tel:0873792059'>087 379 2059</a>
                </div>
                <p>Best regards,<br><strong>The JSU Marketing Team</strong></p>
            </div>
            <div class='footer'><p>&copy; " . date('Y') . " JSU Marketing. All rights reserved.</p></div>
        </div></body></html>";

        $sent = send_followup_email($lead['email'], $subject, $html);

        if ($sent) {
            $updated = sb_patch('leads', $lead['id'], [
                'follow_up_stage'  => 1,
                'last_contacted_at' => $now,
            ]);
            cron_log("Stage 0→1 " . ($updated ? "OK" : "DB update FAILED") . " — {$lead['email']} ({$biz_name})");
        } else {
            cron_log("Stage 0→1 EMAIL FAILED — {$lead['email']} ({$biz_name})");
        }
    }
}

// -----------------------------------------------------------------------
// Stage 1 → 2: last_contacted_at 5+ days ago
// -----------------------------------------------------------------------
$stage1_leads = sb_get('leads', [
    'follow_up_stage'   => 'eq.1',
    'last_contacted_at' => 'lte.' . $five_days_ago,
    'select'            => '*',
]);

if ($stage1_leads === null) {
    cron_log("Stage 1 query failed — skipping");
} else {
    cron_log("Stage 1 leads to follow up: " . count($stage1_leads));

    foreach ($stage1_leads as $lead) {
        $name     = htmlspecialchars($lead['name'] ?? 'there');
        $biz_name = htmlspecialchars($lead['business_name'] ?? 'your business');
        $pkg_name = htmlspecialchars($lead['package_name'] ?? 'your package');
        $pkg_html = package_summary_html($lead);

        $subject = "Last chance — we only take on a limited number of new clients";
        $html    = "<!DOCTYPE html><html><head><style>{$email_styles}</style></head><body>
        <div class='container'>
            <div class='header'><h2>A quick note from JSU Marketing</h2></div>
            <div class='content'>
                <p>Hi {$name},</p>
                <p>We've reached out a couple of times about the <strong>{$pkg_name}</strong> quote for <strong>{$biz_name}</strong>, so this will be our last follow-up — we don't want to clog your inbox!</p>
                <p>We do take on a limited number of new clients each month to make sure every business gets our full attention, so if you're still considering it, now is a good time to reach out before our spots fill up.</p>
                <p>Here's the package we had lined up for you:</p>
                {$pkg_html}
                <p>If the timing isn't right just yet, no problem at all — feel free to come back to us whenever you're ready. We'd love to help grow <strong>{$biz_name}</strong>.</p>
                <div class='contact-box'>
                    <strong>Get in touch:</strong><br>
                    Jack Hayes: <a href='tel:0879449977'>087 944 9977</a><br>
                    Sean Daly: <a href='tel:0873792059'>087 379 2059</a>
                </div>
                <p>Wishing you and <strong>{$biz_name}</strong> all the best,<br><strong>The JSU Marketing Team</strong></p>
            </div>
            <div class='footer'><p>&copy; " . date('Y') . " JSU Marketing. All rights reserved.</p></div>
        </div></body></html>";

        $sent = send_followup_email($lead['email'], $subject, $html);

        if ($sent) {
            $updated = sb_patch('leads', $lead['id'], [
                'follow_up_stage'  => 2,
                'last_contacted_at' => $now,
            ]);
            cron_log("Stage 1→2 " . ($updated ? "OK" : "DB update FAILED") . " — {$lead['email']} ({$biz_name})");
        } else {
            cron_log("Stage 1→2 EMAIL FAILED — {$lead['email']} ({$biz_name})");
        }
    }
}

cron_log("=== Cron run complete ===");
