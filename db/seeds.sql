USE team;

INSERT INTO department (name)
VALUES
("Sales"),
("Engineering"),
("Finance"),
("Legal");


INSERT INTO role (title, salary, department_id)
VALUES
  ('Sales Lead', 100000, "Sales" ),
  ('Salesperson', 80000, "Sales" ),
  ('Lead Engineer', 150000, "Engineering"),
  ('Software Engineer', 120000, "Eingineering" ),
  ('Account Manager', 160000, "Finance" ),
  ('Accountant', 125000, "Finance" ),
  ('Legal Team Lead', 250000, "Legal" ),
  ('Lawyer', 190000, "Legal");


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("John", "Doe", 1, null),
("Mike", "Chan", 2, 1),
("Ashley", "Rodriguez", 3, null),
("Kevin", "Tupik", 4, 3),
("Kunal", "Singh", 5, null),
("Malia", "Brown", 6, 5),
("Sarah", "Lourd", 7, null ),
("Tom", "Allen", 8, 7);




