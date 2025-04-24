<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id'])) {
        try {
            $id = $data['id'];
            $stmt = $db->prepare("DELETE FROM task.task WHERE id = :id");
            $stmt->execute(['id' => $id]);

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
