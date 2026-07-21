<?php
include("../scripts/functions.php");
$id = $_GET['id'];
$query = $conn->query("UPDATE users SET approve = 1 WHERE id = '$id'");
echo "
<script>
alert('User have been Activated');
window.history.go(-1);
</script>

";
?>