<?php

/** @var \vcms\utils\Authentication $Authentication */
if ($Authentication->verify($email, $password)) {
    $Session->User = $Authentication->User;
    $Feedback->success('authentication success.');
}
else {
    $Feedback->failure('username or password incorrect.');
}