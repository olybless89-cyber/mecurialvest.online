<?php
include("../scripts/functions.php");
$id = $_GET['id'];
$query = $conn->query("DELETE FROM login WHERE id = '$id'");
echo "
<script>
alert('Login details have been deleted');
window.history.go(-1);
</script>

";
?>