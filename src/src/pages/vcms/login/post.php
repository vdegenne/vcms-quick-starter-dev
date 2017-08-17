<?php
use vcms\VUser;

$credentialsFilename = PROJECT_LOCATION . '/vcms.credentials';

if (!file_exists($credentialsFilename)) {
    $Feedback->failure('the credentials file was not found');
}

$credentialsContent = file_get_contents($credentialsFilename);
foreach (explode("\r\n", $credentialsContent) as $credentialPair) {
    list($credName, $credPassword) = explode(':', $credentialPair);

    if ($credName === $username && $credPassword === $password) {
        /** @var VUser $VUser */
        $VUser = $_SESSION['VUser'];
        $VUser->name = $username;
        $VUser->isAuthenticated = true;
        $Feedback->success('yeah!');
    }
    else {
        $Feedback->failure('incorrect password');
    }
}