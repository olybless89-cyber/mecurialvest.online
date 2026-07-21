<?php
include("../scripts/functions.php");
$id = $_GET['id'];
$query = $conn->query("UPDATE users SET status = 'blocked' WHERE id = '$id'");
echo "
<script>
alert('User have been suspended');
window.history.go(-1);
</script>

";
?>