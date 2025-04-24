<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;

    if ($id) {
        try {
            // Actualizamos la tarea a "no completada"
            $stmt = $db->prepare("UPDATE task.task SET completed = FALSE WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error al desmarcar la tarea: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Faltan parámetros']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>