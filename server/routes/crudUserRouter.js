import { Router } from 'express';
import { getUserById, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

// Route to get a user's profile by ID
router.get('/users/:id', async (req, res) => {
  // Implementation here
});

//  update
router.put('/users/:id', async (req, res) => {
  // Implementation here
});

router.delete('/users/:id', async (req, res) => {
  // Implementation here
});

export default router;
