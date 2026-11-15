import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, emailOrPhone, email, phone, name, password, role } = body;

    // ── Action: REGISTER ──
    if (action === 'register') {
      const userEmail = email ? email.trim().toLowerCase() : null;
      const userPhone = phone ? phone.trim() : null;

      if (!userEmail && !userPhone) {
        return NextResponse.json({ error: 'Email or phone is required' }, { status: 400 });
      }

      // Check if user already exists
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            ...(userEmail ? [{ email: userEmail }] : []),
            ...(userPhone ? [{ phone: userPhone }] : []),
          ],
        },
      });

      if (existing) {
        return NextResponse.json({
          success: true,
          user: {
            id: existing.id,
            name: existing.name,
            email: existing.email,
            phone: existing.phone,
            role: existing.role,
            language: existing.language,
          },
          message: 'User already exists, logged in',
        });
      }

      // Security Precaution: Prevent unauthorized administrative privilege escalation
      let assignedRole: 'PATIENT' | 'PHARMACIST' | 'ADMIN' = 'PATIENT';
      if (role === 'ADMIN') {
        return NextResponse.json(
          { error: 'Administrative accounts cannot be self-registered. Please contact the system administrator.' },
          { status: 403 }
        );
      } else if (role === 'PHARMACIST') {
        assignedRole = 'PHARMACIST';
      }

      const passwordHash = password ? hashPassword(password) : null;
      const newUser = await prisma.user.create({
        data: {
          name: name || (userEmail ? userEmail.split('@')[0] : 'Nidaan User'),
          email: userEmail,
          phone: userPhone,
          passwordHash,
          role: assignedRole,
          language: 'bn',
        },
      });

      return NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          language: newUser.language,
        },
      });
    }

    // ── Action: LOGIN ──
    if (action === 'login') {
      const identifier = (emailOrPhone || email || phone || '').trim().toLowerCase();
      if (!identifier) {
        return NextResponse.json({ error: 'Email or phone required' }, { status: 400 });
      }

      // Check database
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: identifier },
            { phone: identifier },
          ],
        },
      });

      // If user not in DB, auto-register for seamless zero-friction patient access
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: identifier.includes('@') ? identifier.split('@')[0] : 'Nidaan Patient',
            email: identifier.includes('@') ? identifier : null,
            phone: !identifier.includes('@') ? identifier : null,
            role: 'PATIENT',
            language: 'bn',
          },
        });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          language: user.language,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action. Supported: login, register' }, { status: 400 });

  } catch (error: any) {
    console.error('[/api/auth] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
