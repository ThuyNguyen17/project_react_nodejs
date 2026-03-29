import express from 'express';
import { getModel } from '../models/dynamicModel.js';

const router = express.Router();

router.get('/:resource/getall', async (req, res) => {
  const Model = getModel(req.params.resource);
  const documents = await Model.find();
  // Return in format that frontend expects: { success: true, teachers: [...] }
  const resourceName = req.params.resource.endsWith('s') 
    ? req.params.resource 
    : req.params.resource + 's';
  res.json({ success: true, [resourceName]: documents });
});

router.get('/:resource/all', async (req, res) => {
  const Model = getModel(req.params.resource);
  const documents = await Model.find();
  // Return in format that frontend expects: { success: true, teachers: [...] }
  const resourceName = req.params.resource.endsWith('s') 
    ? req.params.resource 
    : req.params.resource + 's';
  res.json({ success: true, [resourceName]: documents });
});

router.get('/:resource/teacher/:teacherId', async (req, res) => {
  const resource = req.params.resource;
  const Model = getModel(resource);
  const query = { teacherId: req.params.teacherId };
  const documents = await Model.find(query);
  res.json(documents);
});

router.post('/:resource', async (req, res) => {
  const Model = getModel(req.params.resource);
  const document = new Model(req.body);
  await document.save();
  res.status(201).json({ success: true, ...document.toObject() });
});

router.put('/:resource/:id', async (req, res) => {
  const Model = getModel(req.params.resource);
  const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false
  });
  if (!document) return res.status(404).json({ message: 'Resource not found' });
  res.json({ success: true, ...document.toObject() });
});

router.delete('/:resource/:id', async (req, res) => {
  const Model = getModel(req.params.resource);
  const document = await Model.findByIdAndDelete(req.params.id);
  if (!document) return res.status(404).json({ message: 'Resource not found' });
  res.json({ message: 'Deleted successfully' });
});

export default router;
