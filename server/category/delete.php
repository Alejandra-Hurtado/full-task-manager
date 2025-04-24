<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['category_id'])) {
        try {
            $id = $data['category_id'];
            $stmt = $db->prepare("DELETE FROM task.category WHERE category_id = :category_id");
            $stmt->execute(['category_id' => $id]);

            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    } else {
        echo json_encode(["error" => "Missing ID"]);
    }
} else {
    echo json_encode(["error" => "Invalid request"]);
}