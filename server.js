const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dummyLeads = [
  { name: 'Sophia Chen', email: 'sophia.chen@apexdigital.io', phone: '+1 (555) 234-8901', businessName: 'Apex Digital Solutions', status: 'New' },
  { name: 'Marcus Vance', email: 'marcus.vance@horizonlabs.ai', phone: '+1 (555) 872-3341', businessName: 'Horizon Tech Labs', status: 'Contacted' },
  { name: 'Priya Patel', email: 'priya.p@luminahealth.com', phone: '+1 (555) 492-1209', businessName: 'Lumina Health Systems', status: 'Converted' },
  { name: "Liam O'Connor", email: 'liam@greenwavesolar.co', phone: '+1 (555) 781-9920', businessName: 'GreenWave Solar', status: 'New' },
  { name: 'Elena Rostova', email: 'e.rostova@veloceretail.com', phone: '+1 (555) 341-6578', businessName: 'Veloce Omnichannel', status: 'Contacted' },
  { name: 'David Kim', email: 'david.kim@nexuscloud.net', phone: '+1 (555) 609-8432', businessName: 'Nexus Cloud Systems', status: 'Converted' },
  { name: 'Aisha Bello', email: 'aisha@zenithmedia.agency', phone: '+1 (555) 438-7711', businessName: 'Zenith Creative Media', status: 'New' },
  { name: 'Carlos Rodriguez', email: 'c.rodriguez@solsticelogistics.com', phone: '+1 (555) 923-4512', businessName: 'Solstice Supply Chain', status: 'Converted' },
  { name: 'Ananya Roy', email: 'ananya.roy@hyperionfin.com', phone: '+1 (555) 312-8874', businessName: 'Hyperion Capital', status: 'Contacted' },
  { name: 'Benjamin Wright', email: 'ben@cobaltdesign.co', phone: '+1 (555) 674-2390', businessName: 'Cobalt Studio', status: 'New' },
  { name: 'Olivia Martinez', email: 'olivia@aurabranding.com', phone: '+1 (555) 819-4402', businessName: 'Aura Brand Strategy', status: 'Contacted' },
  { name: 'Alexander Scott', email: 'a.scott@quantumdefense.io', phone: '+1 (555) 412-9983', businessName: 'Quantum Cyber Defense', status: 'Converted' },
  { name: 'Fatima Al-Mansoor', email: 'fatima.m@crescentbio.com', phone: '+1 (555) 623-1189', businessName: 'Crescent BioTech', status: 'New' },
  { name: 'Lucas Silva', email: 'lucas.silva@pulseanalytics.net', phone: '+1 (555) 734-5510', businessName: 'Pulse Analytics Corp', status: 'Contacted' },
  { name: 'Chloe Dubois', email: 'chloe@atelierluxe.fr', phone: '+1 (555) 391-7723', businessName: 'Atelier Luxe Commerce', status: 'Converted' },
  { name: 'Tariq Washington', email: 'tariq@metromobility.org', phone: '+1 (555) 845-6601', businessName: 'Metro Urban Mobility', status: 'New' },
  { name: 'Hannah Lindqvist', email: 'hannah@nordiceco.se', phone: '+1 (555) 229-3814', businessName: 'Nordic Eco Ventures', status: 'Contacted' },
  { name: 'Rajiv Menon', email: 'r.menon@finedgepay.in', phone: '+1 (555) 901-4472', businessName: 'FinEdge Payments', status: 'Converted' },
  { name: 'Isabella Rossi', email: 'isabella@bellavita.it', phone: '+1 (555) 512-8839', businessName: 'BellaVita Hospitality', status: 'New' },
  { name: 'Nathan Drake', email: 'nathan@unchartedrobotics.com', phone: '+1 (555) 678-1245', businessName: 'Uncharted Robotics', status: 'Contacted' },
  { name: 'Mei-Ling Zhou', email: 'meiling.zhou@silkroadlog.com', phone: '+1 (555) 334-9021', businessName: 'SilkRoad Logistics', status: 'Converted' },
  { name: 'Julian Thorne', email: 'j.thorne@vanguardsec.co', phone: '+1 (555) 789-2234', businessName: 'Vanguard Cybersecurity', status: 'New' },
  { name: 'Zara Khan', email: 'zara@starlightlearning.org', phone: '+1 (555) 445-6712', businessName: 'Starlight EdTech', status: 'Contacted' },
  { name: 'Ethan Brooks', email: 'ethan@timberlinestudio.com', phone: '+1 (555) 890-3321', businessName: 'Timberline Architecture', status: 'Converted' },
  { name: 'Maya Lin', email: 'maya.lin@synthetix.ai', phone: '+1 (555) 601-9943', businessName: 'Synthetix AI Systems', status: 'New' },
  { name: 'Gabriel Morales', email: 'gabriel@terraverde.co', phone: '+1 (555) 712-4456', businessName: 'Terra Verde AgroTech', status: 'Contacted' },
  { name: 'Sophie Taylor', email: 's.taylor@blueharborcap.com', phone: '+1 (555) 823-1190', businessName: 'BlueHarbor Capital', status: 'Converted' },
  { name: 'Arjun Kapoor', email: 'arjun.k@swiftroute.io', phone: '+1 (555) 456-7890', businessName: 'SwiftRoute Deliveries', status: 'New' },
  { name: 'Natalie Portman-Giles', email: 'natalie@elevatehr.com', phone: '+1 (555) 934-2218', businessName: 'Elevate HR Cloud', status: 'Contacted' },
  { name: 'Daniel Okafor', email: 'd.okafor@saharaclean.energy', phone: '+1 (555) 345-6789', businessName: 'Sahara Clean Energy', status: 'Converted' },
  { name: 'Emma Watson-Lee', email: 'emma@cascademedia.co', phone: '+1 (555) 678-9012', businessName: 'Cascade Media Lab', status: 'New' },
  { name: 'Kenji Sato', email: 'kenji.sato@shibuyai.jp', phone: '+1 (555) 890-1234', businessName: 'Shibuya Interactive', status: 'Contacted' },
  { name: 'Laura Gomez', email: 'laura@tierrahealth.org', phone: '+1 (555) 234-5678', businessName: 'Tierra Health Diagnostics', status: 'Converted' },
  { name: 'Ryan Gallagher', email: 'r.gallagher@forgeiot.com', phone: '+1 (555) 567-8901', businessName: 'Forge Industrial IoT', status: 'New' },
  { name: 'Stephanie Wu', email: 'stephanie@catalystvp.com', phone: '+1 (555) 901-2345', businessName: 'Catalyst Venture Partners', status: 'Contacted' },
  { name: 'Victor Vance', email: 'victor@aerodynetech.com', phone: '+1 (555) 312-4567', businessName: 'Aerodyne Aerospace', status: 'Converted' },
  { name: 'Nadia Yilmaz', email: 'nadia@bosphorusfin.com', phone: '+1 (555) 789-0123', businessName: 'Bosphorus FinTech', status: 'New' },
  { name: 'Christian Becker', email: 'c.becker@rheinland-eng.de', phone: '+1 (555) 456-1234', businessName: 'Rheinland Engineering', status: 'Contacted' },
  { name: 'Zoe Kravitz-Miller', email: 'zoe@prismastudios.tv', phone: '+1 (555) 890-5678', businessName: 'Prisma Content Studios', status: 'Converted' },
  { name: 'Samuel Jackson', email: 'samuel@ironcladlegal.ai', phone: '+1 (555) 234-9012', businessName: 'Ironclad Legal Tech', status: 'New' }
];

function seedIfEmpty() {
  try {
    const count = db.prepare('SELECT COUNT(*) count FROM leads').get().count;
    if (count === 0) {
      const insert = db.prepare('INSERT INTO leads(name, email, phone, businessName, status) VALUES (?, ?, ?, ?, ?)');
      const tx = db.transaction((items) => {
        for (const item of items) {
          insert.run(item.name, item.email, item.phone, item.businessName, item.status);
        }
      });
      tx(dummyLeads);
      console.log(`Seeded ${dummyLeads.length} dummy leads.`);
    }
  } catch (err) {
    console.error('Error auto-seeding leads:', err.message);
  }
}
seedIfEmpty();

function validate(b) {
  if (!b || typeof b !== 'object') return 'All fields are required.';
  const fields = ['name', 'email', 'phone', 'businessName', 'status'];
  if (!fields.every(k => typeof b[k] === 'string' && b[k].trim())) return 'All fields are required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email.trim())) return 'Please enter a valid email address.';
  if (!['New', 'Contacted', 'Converted'].includes(b.status)) return 'Invalid lead status.';
  return null;
}

app.get('/api/dashboard', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) count FROM leads').get().count;
    const newCount = db.prepare("SELECT COUNT(*) count FROM leads WHERE status='New'").get().count;
    const contactedCount = db.prepare("SELECT COUNT(*) count FROM leads WHERE status='Contacted'").get().count;
    const converted = db.prepare("SELECT COUNT(*) count FROM leads WHERE status='Converted'").get().count;
    res.json({ total, new: newCount, contacted: contactedCount, converted });
  } catch(e) {
    res.status(500).json({ error: 'Could not load dashboard summary.' });
  }
});

app.get('/api/leads', (req, res) => {
  try {
    const q = (req.query.search || '').trim();
    const s = (req.query.status || '').trim();
    let sql = 'SELECT * FROM leads WHERE (name LIKE ? OR email LIKE ? OR businessName LIKE ?)';
    let p = [`%${q}%`, `%${q}%`, `%${q}%`];
    if (['New', 'Contacted', 'Converted'].includes(s)) {
      sql += ' AND status=?';
      p.push(s);
    }
    sql += ' ORDER BY id DESC';
    res.json(db.prepare(sql).all(...p));
  } catch(e) {
    res.status(500).json({ error: 'Could not fetch leads.' });
  }
});

app.get('/api/leads/:id', (req, res) => {
  try {
    const lead = db.prepare('SELECT * FROM leads WHERE id=?').get(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });
    res.json(lead);
  } catch(e) {
    res.status(500).json({ error: 'Could not fetch this lead.' });
  }
});

app.post('/api/leads', (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  try {
    const b = req.body;
    const r = db.prepare('INSERT INTO leads(name, email, phone, businessName, status) VALUES(?,?,?,?,?)')
      .run(b.name.trim(), b.email.trim(), b.phone.trim(), b.businessName.trim(), b.status);
    res.status(201).json(db.prepare('SELECT * FROM leads WHERE id=?').get(r.lastInsertRowid));
  } catch(e) {
    res.status(500).json({ error: 'Could not save this lead.' });
  }
});

app.put('/api/leads/:id', (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  try {
    const b = req.body;
    const r = db.prepare('UPDATE leads SET name=?, email=?, phone=?, businessName=?, status=? WHERE id=?')
      .run(b.name.trim(), b.email.trim(), b.phone.trim(), b.businessName.trim(), b.status, req.params.id);
    if (!r.changes) return res.status(404).json({ error: 'Lead not found.' });
    res.json(db.prepare('SELECT * FROM leads WHERE id=?').get(req.params.id));
  } catch(e) {
    res.status(500).json({ error: 'Could not update this lead.' });
  }
});

app.delete('/api/leads/:id', (req, res) => {
  try {
    const r = db.prepare('DELETE FROM leads WHERE id=?').run(req.params.id);
    if (!r.changes) return res.status(404).json({ error: 'Lead not found.' });
    res.json({ message: 'Lead deleted.' });
  } catch(e) {
    res.status(500).json({ error: 'Could not delete this lead.' });
  }
});

app.listen(PORT, () => console.log(`Mini CRM running at http://localhost:${PORT}`));
