const { sendToOllama } = require('../services/ollama');
const repository = require('../db/repository'); // import all DB functions

// Add a new plan and steps
async function addPlan(req, res) {
  const { goal } = req.body;
  if (!goal) {
    return res.status(400).json({ error: 'goal is required' });
  }

  console.log(`Received goal: ${goal}`);

  try {
    // Add plan to DB
    const planId = await repository.addPlan(goal);

    // Send goal to Ollama
    const steps = await sendToOllama(goal);

    const stepsObj = [];
    for (const stepTitle of steps) {
      const step = await repository.addStep(planId, stepTitle);
      stepsObj.push(step);
    }

    // Send response back
    res.status(200).json({
      planId,
      goal,
      steps: stepsObj
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Get plan by ID, including its steps
async function getPlan(req, res) {
  const { id } = req.params;

  try {
    const plan = await repository.getPlanById(id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const steps = await repository.getStepsByPlanId(id);

    res.json({
      id: plan.id,
      goal: plan.goal,
      steps
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Update the status of a step
async function updateStepStatus(req, res) {
  const { id, stepId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }

  try {
    const updated = await repository.updateStepStatus(stepId, status);
    if (updated === 0) {
      return res.status(404).json({ error: 'Step not found' });
    }

    res.json({
      planId: id,
      stepId,
      status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  addPlan,
  getPlan,
  updateStepStatus
};
