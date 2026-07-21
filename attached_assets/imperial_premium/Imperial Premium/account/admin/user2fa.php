<?php
include("../scripts/functions.php");
$id = $_GET['id'];
if($_GET['action'] == "disable"){
$query = $conn->query("UPDATE users SET tfa = 'inactive' WHERE id = '$id'");
echo "
<script>
alert('2FA disabled');
window.history.go(-1);
</script>
";
}else{
$query = $conn->query("UPDATE users SET tfa = 'active' WHERE id = '$id'");
echo "
<script>
alert('2FA Enabled');
window.history.go(-1);
</script>
";	
}
?>