<?php
header('Content-Type: text/plain; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    echo "error";
    exit;
}

$form_type = isset($_POST['form_type']) ? trim($_POST['form_type']) : '';

function send_via_resend($to, $subject, $html, $reply_to = null) {
    $api_key = 're_fmaxR1EW_KoL3dg41x5Yn6HRaCmqL68Kk';
    $payload = [
        'from'    => 'JSU Marketing <noreply@jsumarketing.com>',
        'to'      => [$to],
        'subject' => $subject,
        'html'    => $html
    ];
    if ($reply_to) {
        $payload['reply_to'] = [$reply_to];
    }
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $api_key,
        'Content-Type: application/json'
    ]);
    $response = curl_exec($ch);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $status === 200 || $status === 201;
}

if ($form_type === 'new_request') {
    $client_email = isset($_POST['client_email']) ? trim($_POST['client_email']) : 'Unknown';
    $message      = isset($_POST['message'])      ? trim($_POST['message'])      : '';

    if (empty($message)) {
        http_response_code(400);
        echo "error";
        exit;
    }

    $to      = "jsumarketingteam@gmail.com";
    $subject = "New Client Request — " . htmlspecialchars($client_email);

    $email_body = "<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FFD700 0%, #d97706 100%); color: #000; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .field:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #1a1a1a; }
        .value { color: #555; margin-top: 5px; }
        .footer { background: #f0f0f0; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Client Request</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Client:</div>
                <div class='value'><a href='mailto:" . htmlspecialchars($client_email) . "'>" . htmlspecialchars($client_email) . "</a></div>
            </div>
            <div class='field'>
                <div class='label'>Request:</div>
                <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Submitted:</div>
                <div class='value'>" . date('F j, Y \a\t g:i A') . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>This notification was sent automatically from the JSU Marketing client portal.</p>
        </div>
    </div>
</body>
</html>";

    $sent = send_via_resend($to, $subject, $email_body, $client_email ?: null);

    if (!$sent) {
        http_response_code(500);
        echo "mail_failed";
        exit;
    }

    http_response_code(200);
    echo "success";
    exit;
}

if ($form_type === 'post_review') {
    $action       = isset($_POST['action'])       ? trim($_POST['action'])       : '';
    $platform     = isset($_POST['platform'])     ? trim($_POST['platform'])     : 'Unknown';
    $caption      = isset($_POST['caption'])      ? trim($_POST['caption'])      : '';
    $scheduled    = isset($_POST['scheduled_for'])? trim($_POST['scheduled_for']): '';
    $client_notes = isset($_POST['client_notes']) ? trim($_POST['client_notes']) : '';

    if (!in_array($action, ['approved', 'declined'])) {
        http_response_code(400);
        echo "error";
        exit;
    }

    $to           = "jsumarketingteam@gmail.com";
    $actionLabel  = $action === 'approved' ? 'Approved' : 'Declined';
    $accentColor  = $action === 'approved' ? '#22c55e' : '#ef4444';
    $subject      = "Post {$actionLabel} — " . htmlspecialchars($platform);

    $scheduled_display = $scheduled ? date('F j, Y', strtotime($scheduled)) : 'Not scheduled';

    $notes_block = '';
    if ($action === 'declined' && $client_notes !== '') {
        $notes_block = "
            <div class='field' style='border-left: 4px solid #ef4444; padding-left: 12px;'>
                <div class='label' style='color: #ef4444;'>Client Improvement Notes:</div>
                <div class='value'>" . nl2br(htmlspecialchars($client_notes)) . "</div>
            </div>";
    }

    $email_body = "<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FFD700 0%, #d97706 100%); color: #000; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .status-badge { display: inline-block; background-color: {$accentColor}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-top: 8px; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .field:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #1a1a1a; }
        .value { color: #555; margin-top: 5px; }
        .footer { background: #f0f0f0; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Post Review Update</h2>
            <span class='status-badge'>{$actionLabel}</span>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Platform:</div>
                <div class='value'>" . htmlspecialchars($platform) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Scheduled For:</div>
                <div class='value'>" . htmlspecialchars($scheduled_display) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Caption:</div>
                <div class='value'>" . nl2br(htmlspecialchars($caption)) . "</div>
            </div>
            {$notes_block}
            <div class='field'>
                <div class='label'>Reviewed At:</div>
                <div class='value'>" . date('F j, Y \a\t g:i A') . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>This notification was sent automatically from the JSU Marketing client portal.</p>
        </div>
    </div>
</body>
</html>";

    $sent = send_via_resend($to, $subject, $email_body);

    if (!$sent) {
        http_response_code(500);
        echo "mail_failed";
        exit;
    }

    http_response_code(200);
    echo "success";
    exit;
}

if ($form_type === 'quote_lead') {
    $lead_name     = isset($_POST['name'])             ? trim($_POST['name'])             : '';
    $lead_email    = isset($_POST['email'])            ? trim($_POST['email'])            : '';
    $biz_name      = isset($_POST['business_name'])    ? trim($_POST['business_name'])    : '';
    $biz_type      = isset($_POST['business_type'])    ? trim($_POST['business_type'])    : '';
    $biz_size      = isset($_POST['business_size'])    ? trim($_POST['business_size'])    : '';
    $pkg_name      = isset($_POST['package_name'])     ? trim($_POST['package_name'])     : '';
    $web_feats_raw = isset($_POST['website_features']) ? $_POST['website_features']       : '[]';
    $soc_feats_raw = isset($_POST['social_features'])  ? $_POST['social_features']        : '[]';

    if (empty($lead_email) || !filter_var($lead_email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "error";
        exit;
    }

    $web_feats = json_decode($web_feats_raw, true) ?: [];
    $soc_feats = json_decode($soc_feats_raw, true) ?: [];

    $web_feats_html = '';
    foreach ($web_feats as $f) {
        $web_feats_html .= "<li style='padding:4px 0; border-bottom:1px solid #eee;'>&#10003; " . htmlspecialchars($f) . "</li>";
    }
    $soc_feats_html = '';
    foreach ($soc_feats as $f) {
        $soc_feats_html .= "<li style='padding:4px 0; border-bottom:1px solid #eee;'>&#10003; " . htmlspecialchars($f) . "</li>";
    }

    // --- Team notification ---
    $team_subject = "New Quote Lead — " . htmlspecialchars($biz_name) . " (" . htmlspecialchars($pkg_name) . ")";
    $team_body = "<!DOCTYPE html><html><head><style>
        body{font-family:Arial,sans-serif;line-height:1.6;color:#333;}
        .container{max-width:600px;margin:0 auto;padding:20px;}
        .header{background:linear-gradient(135deg,#FFD700 0%,#d97706 100%);color:#000;padding:20px;border-radius:8px 8px 0 0;text-align:center;}
        .content{background:#f9f9f9;padding:20px;border:1px solid #ddd;}
        .field{margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #eee;}
        .field:last-child{border-bottom:none;}
        .label{font-weight:bold;color:#1a1a1a;}
        .value{color:#555;margin-top:5px;}
        ul{list-style:none;padding:0;margin:8px 0 0 0;}
        .footer{background:#f0f0f0;padding:15px;border-radius:0 0 8px 8px;font-size:12px;color:#999;text-align:center;}
    </style></head><body>
    <div class='container'>
        <div class='header'><h2>New Quote Lead</h2></div>
        <div class='content'>
            <div class='field'><div class='label'>Name:</div><div class='value'>" . htmlspecialchars($lead_name) . "</div></div>
            <div class='field'><div class='label'>Email:</div><div class='value'><a href='mailto:" . htmlspecialchars($lead_email) . "'>" . htmlspecialchars($lead_email) . "</a></div></div>
            <div class='field'><div class='label'>Business:</div><div class='value'>" . htmlspecialchars($biz_name) . "</div></div>
            <div class='field'><div class='label'>Type:</div><div class='value'>" . htmlspecialchars($biz_type) . "</div></div>
            <div class='field'><div class='label'>Size:</div><div class='value'>" . htmlspecialchars($biz_size) . "</div></div>
            <div class='field'><div class='label'>Package:</div><div class='value'><strong>" . htmlspecialchars($pkg_name) . "</strong></div></div>
            <div class='field'><div class='label'>Website Features:</div><ul>" . $web_feats_html . "</ul></div>
            <div class='field'><div class='label'>Social Media Features:</div><ul>" . $soc_feats_html . "</ul></div>
            <div class='field'><div class='label'>Submitted:</div><div class='value'>" . date('F j, Y \a\t g:i A') . "</div></div>
        </div>
        <div class='footer'><p>Sent automatically from the JSU Marketing quote calculator.</p></div>
    </div></body></html>";

    send_via_resend("jsumarketingteam@gmail.com", $team_subject, $team_body, $lead_email);

    // --- Lead confirmation ---
    $lead_subject = "Your JSU Marketing Quote — " . htmlspecialchars($pkg_name);
    $lead_body = "<!DOCTYPE html><html><head><style>
        body{font-family:Arial,sans-serif;line-height:1.6;color:#333;}
        .container{max-width:600px;margin:0 auto;padding:20px;}
        .header{background:linear-gradient(135deg,#FFD700 0%,#d97706 100%);color:#000;padding:20px;border-radius:8px 8px 0 0;text-align:center;}
        .content{background:#f9f9f9;padding:20px;border:1px solid #ddd;}
        .section{margin-bottom:20px;}
        .section-title{font-size:16px;font-weight:bold;color:#1a1a1a;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid #FFD700;}
        ul{list-style:none;padding:0;margin:0;}
        .contact-box{background:#fff;border-left:4px solid #FFD700;padding:14px 18px;margin:20px 0;border-radius:0 6px 6px 0;}
        .cta{display:inline-block;background:#FFD700;color:#000;font-weight:bold;padding:12px 28px;border-radius:24px;text-decoration:none;margin-top:16px;}
        .footer{background:#f0f0f0;padding:15px;border-radius:0 0 8px 8px;font-size:12px;color:#999;text-align:center;}
    </style></head><body>
    <div class='container'>
        <div class='header'><h2>Your Quote from JSU Marketing</h2></div>
        <div class='content'>
            <p>Hi " . htmlspecialchars($lead_name) . ",</p>
            <p>Thanks for using our quote calculator! Here's a summary of the <strong>" . htmlspecialchars($pkg_name) . "</strong> we put together for <strong>" . htmlspecialchars($biz_name) . "</strong>.</p>

            <div class='section'>
                <div class='section-title'>Website</div>
                <ul>" . $web_feats_html . "</ul>
            </div>
            <div class='section'>
                <div class='section-title'>Social Media</div>
                <ul>" . $soc_feats_html . "</ul>
            </div>

            <p>We'd love to jump on a quick call to walk you through everything and answer any questions. No pressure — just a friendly chat about what would work best for <strong>" . htmlspecialchars($biz_name) . "</strong>.</p>

            <div class='contact-box'>
                <strong>Get in touch:</strong><br>
                Jack Hayes: <a href='tel:0879449977'>087 944 9977</a><br>
                Sean Daly: <a href='tel:0873792059'>087 379 2059</a>
            </div>

            <p>Or simply reply to this email and we'll get back to you within 24 hours.</p>
            <p>Looking forward to working with you,<br><strong>The JSU Marketing Team</strong></p>
        </div>
        <div class='footer'><p>&copy; " . date('Y') . " JSU Marketing. All rights reserved.</p></div>
    </div></body></html>";

    $lead_sent = send_via_resend($lead_email, $lead_subject, $lead_body, "jsumarketingteam@gmail.com");

    http_response_code($lead_sent ? 200 : 500);
    echo $lead_sent ? "success" : "mail_failed";
    exit;
}

$full_name = isset($_POST['full_name']) ? trim($_POST['full_name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if (empty($full_name) || empty($email) || empty($phone) || empty($message)) {
    http_response_code(400);
    echo "error";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "error";
    exit;
}

$to = "jsumarketingteam@gmail.com";
$subject = "New Contact Form - " . htmlspecialchars($full_name);

// Better email body with HTML
$email_body = "<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FFD700 0%, #d97706 100%); color: #000; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .field:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #1a1a1a; }
        .value { color: #555; margin-top: 5px; }
        .footer { background: #f0f0f0; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; color: #999; text-align: center; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Full Name:</div>
                <div class='value'>" . htmlspecialchars($full_name) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></div>
            </div>
            <div class='field'>
                <div class='label'>Phone:</div>
                <div class='value'>" . htmlspecialchars($phone) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Message:</div>
                <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Submitted:</div>
                <div class='value'>" . date('F j, Y \a\t g:i A') . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>This is a form submission from your website contact form.</p>
        </div>
    </div>
</body>
</html>";

$mail_sent = send_via_resend($to, $subject, $email_body, $email);

if (!$mail_sent) {
    http_response_code(500);
    echo "error";
    exit;
}

// Send confirmation email to user
$user_subject = "We Received Your Message - JSU Marketing";
$user_body = "<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FFD700 0%, #d97706 100%); color: #000; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; line-height: 1.8; }
        .footer { background: #f0f0f0; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; color: #999; text-align: center; }
        .contact-info { background: #fff; padding: 15px; border-left: 3px solid #FFD700; margin: 15px 0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Thank You!</h2>
        </div>
        <div class='content'>
            <p>Hi " . htmlspecialchars($full_name) . ",</p>

            <p>Thank you for reaching out to JSU Marketing! We've received your message and really appreciate your interest in our services.</p>

            <p>Our team will review your inquiry and get back to you within 24 hours. We look forward to discussing how we can help grow your business!</p>

            <div class='contact-info'>
                <strong>Quick Contact:</strong><br>
                Jack Hayes: (087) 944 9977<br>
                Sean Daly: (087) 379 2059
            </div>

            <p>Best regards,<br><strong>The JSU Marketing Team</strong></p>
        </div>
        <div class='footer'>
            <p>&copy; 2024 JSU Marketing. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";

send_via_resend($email, $user_subject, $user_body, $to);

http_response_code(200);
echo "success";
?>