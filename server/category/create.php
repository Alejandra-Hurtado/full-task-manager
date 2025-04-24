<?php
require '../commons/db.php';

var_dump($_SERVER['REQUEST_METHOD']);
$data = json_decode(file_get_contents('php://input'), true);
var_dump($data);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (
        trim($_POST['category_id']) != '' &&
        trim($_POST['name']) != '' &&
        trim($_POST['user_id']) != ''
    ) {

        try {
            $q = "INSERT INTO task.category(category_id, name, user_id)
             VALUES (:category_id, :name, :user_id);";

            $stmt = $db->prepare($q);
            $stmt->execute([
                "category_id" => $_POST["category_id"],
                "name" => $_POST["name"],
                "user_id" => $_POST["user_id"]
            ]);
        } catch (PDOException $e) {
            echo 'Error en la conexión ' . $e->getMessage();
            exit();
        }

        header("Location: /full-task-manager/");

    } else {
        echo 'Nooooooooooo pasa';
    }
}

?>