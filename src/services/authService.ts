/**
 * MineX Enterprise Authentication & Verification Service Abstraction
 * 
 * Production Target:
 * - SMS Gateway / Telecom OTP Provider (NIC / CDAC Government Gateway / Twilio / AWS SNS)
 * - Directorate Public Key Infrastructure (PKI) / CAC Hardware Token / e-Pramaan SSO
 * 
 * For this prototype, all operations are cleanly abstracted so real providers can be plugged in
 * without modifying UI workflows.
 */

import { AccessApprovalStatus, UserRole, User, UserAccessRequest } from '../types';

export interface OtpSession {
  contact: string;
  maskedContact: string;
  timestamp: number;
  role: UserRole;
  isSimulated: boolean;
}

export class MineXAuthService {
  private static activeOtpSession: OtpSession | null = null;
  public static DEMO_ADMIN_KEY = 'XYZW';

  /**
   * Masks a contact number for secure display (e.g. +91 94*** ***91)
   */
  static maskContact(contact: string): string {
    const cleaned = contact.replace(/\s+/g, '');
    if (cleaned.length < 8) return contact;
    const prefix = cleaned.slice(0, Math.min(5, cleaned.length - 4));
    const suffix = cleaned.slice(-2);
    return `${prefix}*** ***${suffix}`;
  }

  /**
   * Initiates OTP generation flow
   * Note: In this prototype, this simulates dispatch and records a session.
   */
  static async requestOtp(
    contact: string,
    role: UserRole
  ): Promise<{ success: boolean; maskedContact: string; message: string }> {
    const masked = this.maskContact(contact);
    this.activeOtpSession = {
      contact,
      maskedContact: masked,
      timestamp: Date.now(),
      role,
      isSimulated: true
    };

    return {
      success: true,
      maskedContact: masked,
      message: 'Verification code dispatched to registered contact (Demo code: any 6 digits e.g. 123456).'
    };
  }

  /**
   * Verifies 6-digit OTP
   */
  static async verifyOtp(otp: string): Promise<{ success: boolean; error?: string }> {
    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return { success: false, error: 'Please enter a valid 6-digit numerical verification code.' };
    }
    // Demo acceptance: any valid 6-digit code is accepted for rapid demonstration
    return { success: true };
  }

  /**
   * Verifies Directorate Administrator Access Key (Prototype key: XYZW)
   */
  static async verifyAdminAccessKey(key: string): Promise<{ success: boolean; error?: string }> {
    const trimmed = key.trim();
    if (trimmed.toUpperCase() === this.DEMO_ADMIN_KEY) {
      return { success: true };
    }
    return {
      success: false,
      error: 'Invalid Administrator Access Key. For this prototype evaluation, use: XYZW'
    };
  }
}
