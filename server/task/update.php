<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (
        isset($data['id']) &&
        isset($data['title']) &&
        isset($data['description']) &&
        isset($data['due_date']) &&
        isset($data['completed']) &&
        isset($data['category_id'])
    ) {
        try {
            $stmt = $db->prepare("UPDATE task.task SET title = :title, description = :description, due_date = :due_date, completed = :completed, category_id = :category_id WHERE id = :id");
            $stmt->execute([
                'id' => $data['id'],
                'title' => $data['title'],
                'description' => $data['description'],
                'due_date' => $data['due_date'],
                'completed' => $data['completed'],
                'category_id' => $data['category_id']
            ]);

            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    } else {
        echo json_encode(["error" => "Missing fields"]);
    }
} else {
    echo json_encode(["error" => "Invalid request"]);
}