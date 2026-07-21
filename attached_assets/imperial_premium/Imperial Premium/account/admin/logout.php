<?php
session_start();
unset($_SESSION['userAdmin']);
unset($_SESSION['loggedAdmin']);

echo"<script>
    window.location.href='login';
</script>";

 ?>