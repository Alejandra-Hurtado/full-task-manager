<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require '../commons/db.php';

// Validamos si se pasó el user_id
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

// Consulta base
$sql = "SELECT task.id, task.title, task.description AS description, task.completed, category.name AS category
FROM task.task
JOIN task.category ON task.category_id = category.category_id";

$params = [];

if ($user_id > 0) {
    $sql .= " WHERE task.user_id = :user_id";
    $params[':user_id'] = $user_id;
}

$stmt = $db->prepare($sql);
$stmt->execute($params);

$tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($tasks);
?>
