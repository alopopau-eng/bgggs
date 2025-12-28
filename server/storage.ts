import { 
  type User, 
  type InsertUser, 
  type StoredApplication,
  type Application,
  type PersonalInfo,
  type ContactInfo,
  type EmergencyContact,
  type DocumentInfo,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createApplication(data: Application): Promise<StoredApplication>;
  getApplication(referenceNumber: string): Promise<StoredApplication | undefined>;
  updateApplicationStatus(referenceNumber: string, status: string): Promise<StoredApplication | undefined>;
}

function generateReferenceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `APP-${timestamp}${random}`;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private applications: Map<string, StoredApplication>;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createApplication(data: Application): Promise<StoredApplication> {
    const id = randomUUID();
    const referenceNumber = generateReferenceNumber();
    
    const application: StoredApplication = {
      id,
      referenceNumber,
      applicationType: data.applicationType,
      status: "submitted",
      paymentStatus: "pending",
      personalInfo: data.personalInfo as unknown as PersonalInfo,
      contactInfo: data.contactInfo as unknown as ContactInfo,
      emergencyContact: data.emergencyContact as unknown as EmergencyContact,
      documentInfo: data.documentInfo as unknown as DocumentInfo,
      termsAccepted: data.termsAccepted,
    };
    
    this.applications.set(referenceNumber, application);
    return application;
  }

  async getApplication(referenceNumber: string): Promise<StoredApplication | undefined> {
    return this.applications.get(referenceNumber);
  }

  async updateApplicationStatus(referenceNumber: string, status: string): Promise<StoredApplication | undefined> {
    const existing = this.applications.get(referenceNumber);
    if (!existing) return undefined;
    
    const updated: StoredApplication = { ...existing, status };
    this.applications.set(referenceNumber, updated);
    return updated;
  }
}

export const storage = new MemStorage();
