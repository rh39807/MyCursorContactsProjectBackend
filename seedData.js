const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Contact = require('./models/Contact');

// Update Contact schema to include new fields
const contactSchema = Contact.schema;
contactSchema.add({
  company: String,
  title: String,
  notes: String,
  tags: [String]
});

const BATCH_SIZE = 1000; // Number of records to insert at once
const TOTAL_RECORDS = 30000;

async function generateContacts(count, startIndex) {
  const contacts = [];
  const companies = ['Apple', 'Google', 'Microsoft', 'Amazon', 'Meta']; // For more realistic data
  const titles = ['Software Engineer', 'Product Manager', 'Designer', 'Director', 'VP'];
  const tags = ['client', 'vendor', 'partner', 'lead', 'customer'];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const uniqueIndex = startIndex + i;
    contacts.push({
      firstName,
      lastName,
      // Ensure unique email by including an index
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${uniqueIndex}@example.com`,
      phone: faker.phone.number(),
      address: faker.location.streetAddress(true),
      company: faker.helpers.arrayElement(companies),
      title: faker.helpers.arrayElement(titles),
      notes: faker.lorem.paragraph(),
      tags: faker.helpers.arrayElements(tags, { min: 1, max: 3 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    });
  }
  return contacts;
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://mongodb:27017/contacts_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Contact.deleteMany({});
    console.log('Cleared existing contacts');

    let insertedCount = 0;
    let errorCount = 0;
    const startTime = Date.now();

    // Insert data in batches
    for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
      try {
        const batchSize = Math.min(BATCH_SIZE, TOTAL_RECORDS - i);
        const contacts = await generateContacts(batchSize, i);
        
        const result = await Contact.insertMany(contacts, { 
          ordered: false,
          rawResult: true 
        });
        
        insertedCount += result.insertedCount;
        
        // Show progress
        const progress = ((insertedCount / TOTAL_RECORDS) * 100).toFixed(1);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`Progress: ${progress}% (${insertedCount}/${TOTAL_RECORDS}) - ${elapsed}s elapsed`);
      } catch (error) {
        errorCount++;
        console.error(`Batch error at ${i}-${i + BATCH_SIZE}:`, error.message);
        // Continue with next batch even if this one partially failed
      }
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\nSeeding completed!`);
    console.log(`Inserted ${insertedCount} records in ${totalTime} seconds`);
    console.log(`Failed batches: ${errorCount}`);
    console.log(`Average rate: ${(insertedCount / totalTime).toFixed(1)} records/second`);

  } catch (error) {
    console.error('Fatal error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding
seedDatabase(); 