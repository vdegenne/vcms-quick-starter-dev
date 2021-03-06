<?php
use vcms\VUser;

/* create the User Object if any */
if (!isset($_SESSION['VUser'])) {
    $VUser = new VUser('anonymous');
    $_SESSION['VUser'] = $VUser;
} else {
    $VUser = $_SESSION['VUser'];
}

/* redirect if no continue GET parameter */
if (!$VUser->isAuthenticated && !isset($QueryString->continue)) {
    header('location: ?continue=/vcms');
}


if (!$VUser->isAuthenticated): ?>

   <custom-style>
      <style>
         html {
            --app-bar-height: 100px;
         }
         vcms-app-bar {
            height: var(--app-bar-height);
         }
         #signin-wrapper {
            position: relative;
            height: calc(100% - var(--app-bar-height) - 1px); /* 1px for the border */
         }
      </style>
   </custom-style>

   <vcms-shell></vcms-shell>
<?php else: ?>

<vcms-shell></vcms-shell>

<?php endif; ?>