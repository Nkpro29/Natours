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

export default { getAllUsers, getUser, createUser, updateUser, deleteUser };
