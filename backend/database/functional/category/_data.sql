/**
 * @load category
 */
INSERT INTO [functional].[category]
([idAccount], [idUser], [name], [description], [color], [icon], [isDefault], [sortOrder])
VALUES
(1, 1, 'Trabalho', 'Tarefas relacionadas ao trabalho', '#FF5722', 'briefcase', 1, 1),
(1, 1, 'Pessoal', 'Tarefas pessoais e do dia a dia', '#4CAF50', 'home', 1, 2),
(1, 1, 'Estudos', 'Tarefas relacionadas a estudos e aprendizado', '#2196F3', 'book', 1, 3),
(1, 1, 'Sem Categoria', 'Tarefas sem categoria definida', '#9E9E9E', 'inbox', 1, 999);
GO