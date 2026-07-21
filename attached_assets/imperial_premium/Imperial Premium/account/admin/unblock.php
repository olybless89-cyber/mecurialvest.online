<?php
include("../scripts/functions.php");
$id = $_GET['id'];
$query = $conn->query("UPDATE users SET status = 'active' WHERE id = '$id'");
echo "
<script>
alert('User have been Unblocked');
window.history.go(-1);
</script>

";
?>