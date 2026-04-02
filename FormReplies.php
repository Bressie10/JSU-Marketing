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

// Important: Use a proper From address (should be from your domain)
$domain = $_SERVER['www.jsumarketing.com'] ?? $_SERVER['SERVER_NAME'] ?? 'jsumarketing.com';
$from_email = "noreply@" . $domain;

// Headers to improve deliverability
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: " . $from_email . "\r\n";
$headers .= "Reply-To: " . htmlspecialchars($email) . "\r\n";
$headers .= "Return-Path: " . htmlspecialchars($email) . "\r\n";
$headers .= "X-Mailer: JSU Marketing Form\r\n";
$headers .= "X-Priority: 3\r\n";
$headers .= "X-MSMail-Priority: Normal\r\n";

// Send email
$mail_sent = mail($to, $subject, $email_body, $headers);

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

$user_headers = "MIME-Version: 1.0\r\n";
$user_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$user_headers .= "From: " . $from_email . "\r\n";
$user_headers .= "Reply-To: " . $to . "\r\n";
$user_headers .= "X-Mailer: JSU Marketing Form\r\n";

// Send confirmation (non-critical)
@mail($email, $user_subject, $user_body, $user_headers);

http_response_code(200);
echo "success";
?>