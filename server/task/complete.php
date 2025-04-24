<?php
require '../commons/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $id = $data['id'];

    try {
        // Actualizamos el valor a TRUE en lugar de 1
        $stmt = $db->prepare("UPDATE task.task SET completed = TRUE WHERE id = :id");
        $stmt->execute(['id' => $id]);

        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'DB Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'No task ID provided']);
}
?>