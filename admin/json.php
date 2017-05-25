<?php

//create database variables
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "geo_tagging";

try 
{
    $conn = new PDO("mysql:host=$servername", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      $conn->query("use $dbname");	
	
	if($_GET["duration"] == 0)
	{
		 $stmt = $conn->prepare("SELECT latitude , longitude from data GROUP BY latitude , longitude");
	}
	else if($_GET["duration"] == 5)
	{
  		$stmt = $conn->prepare("SELECT latitude , longitude from data 
  								where data_accessed_time > DATE_SUB(NOW(), INTERVAL 5 MINUTE) GROUP BY latitude , longitude"); 
	}
	else
	{
		$stmt = $conn->prepare("SELECT distinct latitude , longitude from data where 
							data_accessed_time between :par1 AND :par2 GROUP BY latitude , longitude");
	    $stmt->bindParam(':par1',$_GET["from"]);
   		$stmt->bindParam(':par2',$_GET["to"]);
	}

	$stmt->execute();
	$count = $stmt->rowCount();
	//echo $count;
	$data = $stmt->fetchAll();

	//echo print_r($json_arr);

	//Printing the required lat and long co-ordinates and returned to admin page in json format
	echo json_encode($data);	

}
catch(PDOException $e)
{
    echo "connection Error!";
}

$conn = null;

?>