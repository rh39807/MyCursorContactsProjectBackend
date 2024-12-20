const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Get all contacts with search/filter
router.get('/', async (req, res, next) => {
  try {
    const { search, emailFilter, emailRegex, sort, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = {};
    const conditions = [];

    // General search
    if (search) {
      console.log('Search query:', search);
      const searchCondition = {
        $or: [
          { firstName: new RegExp(search, 'i') },
          { lastName: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { phone: new RegExp(search, 'i') },
          { company: new RegExp(search, 'i') },
          { title: new RegExp(search, 'i') },
          { tags: { $elemMatch: { $regex: new RegExp(search, 'i') } } }
        ]
      };
      conditions.push(searchCondition);
      console.log('Search condition:', JSON.stringify(searchCondition, null, 2));
    }

    // Name filters
    const { firstName, lastName, firstNameRegex, lastNameRegex } = req.query;
    if (firstName) {
      try {
        const pattern = firstNameRegex === 'true'
          ? firstName
          : firstName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        conditions.push({ 
          firstName: new RegExp(pattern, firstNameRegex === 'true' ? '' : 'i') 
        });
      } catch (e) {
        return res.status(400).json({ 
          message: 'Invalid first name regex pattern',
          details: e.message 
        });
      }
    }
    if (lastName) {
      try {
        const pattern = lastNameRegex === 'true'
          ? lastName
          : lastName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        conditions.push({ 
          lastName: new RegExp(pattern, lastNameRegex === 'true' ? '' : 'i') 
        });
      } catch (e) {
        return res.status(400).json({ 
          message: 'Invalid last name regex pattern',
          details: e.message 
        });
      }
    }

    // Phone filter
    const { phone, phoneRegex } = req.query;
    if (phone) {
      try {
        const pattern = phoneRegex === 'true'
          ? phone
          : phone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        conditions.push({ 
          phone: new RegExp(pattern, phoneRegex === 'true' ? '' : 'i') 
        });
      } catch (e) {
        return res.status(400).json({ 
          message: 'Invalid phone regex pattern',
          details: e.message 
        });
      }
    }

    // Email filter
    if (emailFilter) {
      try {
        const pattern = emailRegex === 'true' 
          ? emailFilter
          : emailFilter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        const emailCondition = { 
          email: new RegExp(pattern, emailRegex === 'true' ? '' : 'i') 
        };
        conditions.push(emailCondition);
      } catch (e) {
        return res.status(400).json({ 
          message: 'Invalid regex pattern',
          details: e.message 
        });
      }
    }

    // Company filter
    const { companyFilter } = req.query;
    if (companyFilter) {
      const companies = Array.isArray(companyFilter) ? companyFilter : [companyFilter];
      if (companies.length > 0) {
        conditions.push({ company: { $in: companies } });
      }
    }

    // Title filter
    const { titleFilter } = req.query;
    if (titleFilter) {
      const titles = Array.isArray(titleFilter) ? titleFilter : [titleFilter];
      if (titles.length > 0) {
        conditions.push({ title: { $in: titles } });
      }
    }

    // Tags filter
    const { tagsFilter } = req.query;
    if (tagsFilter) {
      const tags = Array.isArray(tagsFilter) ? tagsFilter : [tagsFilter];
      if (tags.length > 0) {
        conditions.push({ tags: { $in: tags } });
      }
    }

    // Combine all conditions
    if (conditions.length > 0) {
      query.$and = conditions;
    }

    // Get total count before pagination
    const total = await Contact.countDocuments(query);
    console.log('Total matching documents:', total);

    // If no results found with filter, return empty immediately
    if (total === 0) {
      return res.json({
        contacts: [],
        totalCount: 0,
        currentPage: parseInt(page)
      });
    }

    // Build sort
    let sortQuery = {};
    if (sort) {
      const [field, order] = sort.split(':');
      sortQuery[field] = order === 'desc' ? -1 : 1;
    }

    const contacts = await Contact.find(query)
      .sort(sortQuery)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({
      contacts,
      totalCount: total,
      currentPage: parseInt(page)
    });
  } catch (error) {
    next(error);
  }
});

// Get single contact
router.get('/:id', async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

// Create contact
router.post('/', async (req, res, next) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    req.cache.flushAll(); // Clear cache when data changes
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

// Update contact
router.put('/:id', async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    req.cache.flushAll(); // Clear cache when data changes
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

// Delete contact
router.delete('/:id', async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    req.cache.flushAll(); // Clear cache when data changes
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 