<?php
/** @var \vcms\utils\Authentication $Authentication */
$success = $Authentication->authenticate($email, $password);

if ($success) {
    $Feedback->success('authentication success', $Authentication->User);
}
else {
    $Feedback->failure('the login informations are not valid');
}