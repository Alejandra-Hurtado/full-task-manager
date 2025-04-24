<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['user_id'])) {
        try {
            $user_id = $_GET['user_id'];
            // Consultar las categorías del usuario
            $q = "SELECT * FROM task.category WHERE user_id = :user_id";
            $stmt = $db->prepare($q);
            $stmt->execute(['user_id' => $user_id]);
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($categories);
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Error al obtener categorías: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'ID de usuario no proporcionado']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>