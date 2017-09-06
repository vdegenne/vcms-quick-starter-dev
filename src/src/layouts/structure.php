<!doctype html>
<html>
<head>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1, user-scalable=yes">

<title><?= $Project->name . ' ~ ' . $title ?></title>

<script src="/bower_components/webcomponentsjs/webcomponents-loader.js"></script>

<?php @include $head; ?>

<?=$inlines?>

</head>

<body>
<?php @include $body; ?>

</body>
</html>