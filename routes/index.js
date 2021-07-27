var express = require('express');
var router = express.Router();

var veg_controller = require('../controllers/vegController');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Index' });
// });
router.get('/', veg_controller.index);

router.get('/info', function(req, res, next) {
  res.render('info', { title: 'Info' });
});

router.get('/month/:name', veg_controller.month_detail);

router.get('/veg/create', veg_controller.veg_create_get);
router.post('/veg/create', veg_controller.veg_create_post);

router.get('/veg/:name/delete', veg_controller.veg_delete_get);
router.post('/veg/:name/delete', veg_controller.veg_delete_post);

router.get('/veg/:name/update', veg_controller.veg_update_get);
router.post('/veg/:name/update', veg_controller.veg_update_post);

router.get('/veg/:name', veg_controller.veg_detail);

router.get('/veg_list', veg_controller.veg_list);

module.exports = router;
