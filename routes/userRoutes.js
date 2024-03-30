import express from 'express';
const router = express.Router();


const getAllUsers = (req, res) => {
    res.status(200).json({
      status: 'success',
      data: users,
    });
  };
  
  const getUser = (req, res) => {
    res.status(500).json({});
  };
  
  const createUser = (req, res) => {
    res.status(500).json({});
  };
  const updateUser = (req, res) => {
    res.status(500).json({});
  };
  const deleteUser = (req, res) => {
    res.status(500).json({});
  };

router.route('/').get(getAllUsers).post(createUser);
router.route('/:userId').get(getUser).patch(updateUser).delete(deleteUser);


export default router;