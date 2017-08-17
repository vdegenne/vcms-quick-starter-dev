<?php

session_start();
session_unset();
session_destroy();
$var == 'test';
header('location: /');