const fs = require('fs').promises;
const path = require('path');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contacts:', error.message);
    return [];
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(c => c.id === contactId);
    return contact || null;
  } catch (error) {
    console.error('Error getting contact by ID:', error.message);
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const updatedContacts = contacts.filter(c => c.id !== contactId);

    if (contacts.length === updatedContacts.length) {
      return null;
    }

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return getContactById(contactId);
  } catch (error) {
    console.error('Error removing contact:', error.message);
    return null;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = { id: Date.now().toString(), name, email, phone };
    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.error('Error adding contact:', error.message);
    return null;
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
