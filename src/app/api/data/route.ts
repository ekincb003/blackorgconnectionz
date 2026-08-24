import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  INITIAL_USERS,
  INITIAL_ORGS,
  INITIAL_MESSAGES,
  INITIAL_GROUP_CHATS,
  INITIAL_CLAIM_REQUESTS,
  INITIAL_NOTIFICATIONS,
  sortOrganizationsByFounding
} from '../../../lib/seedData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'platform_db.json');

function ensureDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      users: INITIAL_USERS,
      organizations: sortOrganizationsByFounding(INITIAL_ORGS),
      messages: INITIAL_MESSAGES,
      groupChats: INITIAL_GROUP_CHATS,
      claimRequests: INITIAL_CLAIM_REQUESTS,
      notifications: INITIAL_NOTIFICATIONS,
      appLogo: null,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
    return defaultData;
  }

  try {
    const fileData = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error('Error reading DB file, returning defaults:', err);
    return {
      users: INITIAL_USERS,
      organizations: sortOrganizationsByFounding(INITIAL_ORGS),
      messages: INITIAL_MESSAGES,
      groupChats: INITIAL_GROUP_CHATS,
      claimRequests: INITIAL_CLAIM_REQUESTS,
      notifications: INITIAL_NOTIFICATIONS,
      appLogo: null,
      lastUpdated: new Date().toISOString()
    };
  }
}

export async function GET() {
  try {
    const db = ensureDbExists();
    return NextResponse.json({
      success: true,
      data: db
    });
  } catch (error) {
    console.error('GET /api/data error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentDb = ensureDbExists();

    const updatedDb = {
      ...currentDb,
      ...(body.users !== undefined && { users: body.users }),
      ...(body.organizations !== undefined && { organizations: sortOrganizationsByFounding(body.organizations) }),
      ...(body.messages !== undefined && { messages: body.messages }),
      ...(body.groupChats !== undefined && { groupChats: body.groupChats }),
      ...(body.claimRequests !== undefined && { claimRequests: body.claimRequests }),
      ...(body.notifications !== undefined && { notifications: body.notifications }),
      ...(body.appLogo !== undefined && { appLogo: body.appLogo }),
      lastUpdated: new Date().toISOString()
    };

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(updatedDb, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      lastUpdated: updatedDb.lastUpdated
    });
  } catch (error) {
    console.error('POST /api/data error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
  }
}
