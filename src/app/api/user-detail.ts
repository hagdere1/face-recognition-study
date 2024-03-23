import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../db';
import UserDetail from '../../../models/UserDetail';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const data = await UserDetail.find();

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};