import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export interface CreateLeadInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closedWon' | 'closedLost' | 'nurture' | 'optedOut';
  source: 'website' | 'referral' | 'socialMedia' | 'coldOutreach' | 'event' | 'advertising' | 'zillow' | 'realtorCom' | 'homesCom' | 'manualEntry' | 'emailParsing' | 'other';
  assignedToId?: string;
  notes?: string;
  tags?: string[];
  priority?: 'hot' | 'warm' | 'cold';
  propertyInterest?: any;
  budget?: any;
  timeline?: 'immediate' | 'one_to_three_months' | 'three_to_six_months' | 'six_to_twelve_months' | 'just_browsing';
  preApproved?: boolean;
  consentGiven?: boolean;
}

export interface UpdateLeadInput {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closedWon' | 'closedLost' | 'nurture' | 'optedOut';
  source?: 'website' | 'referral' | 'socialMedia' | 'coldOutreach' | 'event' | 'advertising' | 'zillow' | 'realtorCom' | 'homesCom' | 'manualEntry' | 'emailParsing' | 'other';
  assignedToId?: string;
  notes?: string;
  tags?: string[];
  lastContacted?: Date;
  nextFollowUp?: Date;
  priority?: 'hot' | 'warm' | 'cold';
  propertyInterest?: any;
  budget?: any;
  timeline?: 'immediate' | 'one_to_three_months' | 'three_to_six_months' | 'six_to_twelve_months' | 'just_browsing';
  preApproved?: boolean;
  consentGiven?: boolean;
}

export class LeadService {
  async createLead(input: CreateLeadInput) {
    try {
      const lead = await client.models.Lead.create({
        ...input,
        tags: input.tags || undefined,
      });
      return lead;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }

  async getLead(id: string) {
    try {
      const lead = await client.models.Lead.get({ id });
      return lead;
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  }

  async listLeads() {
    try {
      const leads = await client.models.Lead.list();
      return leads.data.map(lead => ({
        ...lead,
        tags: lead.tags || [],
      }));
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  async updateLead(input: UpdateLeadInput) {
    try {
      const { id, lastContacted, nextFollowUp, ...updateData } = input;
      const lead = await client.models.Lead.update({
        id,
        ...updateData,
        lastContacted: lastContacted?.toISOString(),
        nextFollowUp: nextFollowUp?.toISOString(),
        tags: updateData.tags || undefined,
      });
      return lead;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  }

  async deleteLead(id: string) {
    try {
      await client.models.Lead.delete({ id });
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }

  async getLeadsByStatus(status: string) {
    try {
      const leads = await client.models.Lead.list({
        filter: {
          status: { eq: status }
        }
      });
      return leads.data.map(lead => ({
        ...lead,
        tags: lead.tags || [],
      }));
    } catch (error) {
      console.error('Error fetching leads by status:', error);
      throw error;
    }
  }

  async getLeadsBySource(source: string) {
    try {
      const leads = await client.models.Lead.list({
        filter: {
          source: { eq: source }
        }
      });
      return leads.data.map(lead => ({
        ...lead,
        tags: lead.tags || [],
      }));
    } catch (error) {
      console.error('Error fetching leads by source:', error);
      throw error;
    }
  }
}

export const leadService = new LeadService(); 