const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployees)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployees);

    router.route('/:id')
        .get(employeesController.getEmployees);

module.exports = router;