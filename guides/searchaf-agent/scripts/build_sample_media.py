#!/usr/bin/env python3
"""Regenerate synthetic Atlas media. Developer-only: requires reportlab and Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

DATA = Path(__file__).resolve().parents[1] / 'sample-data'


def font(size):
    return ImageFont.load_default(size=size)


def build_pdf():
    path = DATA / 'atlas-support-guide.pdf'
    pdf = canvas.Canvas(str(path), pagesize=letter, invariant=1)
    pdf.setTitle('Project Atlas - support guide (synthetic workshop data)')
    pdf.setAuthor('Antfly workshop')
    pdf.setFillColor(HexColor('#b77708'))
    pdf.rect(48, 724, 516, 4, fill=1, stroke=0)
    pdf.setFillColor(HexColor('#182331'))
    pdf.setFont('Helvetica-Bold', 24)
    pdf.drawString(48, 679, 'Project Atlas support guide')
    pdf.setFont('Helvetica', 11)
    pdf.drawString(48, 651, 'Synthetic workshop data | Approved support procedure | September 8, 2026')
    pdf.setFont('Helvetica-Bold', 17)
    pdf.drawString(48, 595, 'ATLAS-403: Session expired')
    pdf.setFont('Helvetica', 13)
    for y, line in zip([559, 533, 507, 481], [
        'An ATLAS-403 error means the current sign-in session has expired.',
        'Ask the customer to sign out, then sign in again.',
        'Do not ask the customer to delete their local cache.',
        'If the error persists, escalate to the support owner with the error code.',
    ]):
        pdf.drawString(48, y, line)
    pdf.setFont('Helvetica-Bold', 15)
    pdf.drawString(48, 419, 'Scope of this guide')
    pdf.setFont('Helvetica', 12)
    pdf.drawString(48, 388, 'This procedure covers ATLAS-403 only. Other error codes need their own evidence.')
    pdf.drawString(48, 364, 'This document does not establish an approved budget or completed launch gates.')
    pdf.setStrokeColor(HexColor('#d8d5cd'))
    pdf.line(48, 70, 564, 70)
    pdf.setFont('Helvetica', 10)
    pdf.drawString(48, 49, 'Atlas workshop / support packet')
    pdf.drawRightString(564, 49, '1 / 1')
    pdf.save()


def build_screenshot():
    image = Image.new('RGB', (1400, 840), '#f5f3ef')
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 1400, 94), fill='#182331')
    draw.text((64, 26), 'Atlas / Customer workspace', fill='white', font=font(33))
    draw.text((64, 141), 'Document sync', fill='#182331', font=font(46))
    draw.text((64, 210), 'Synthetic workshop screenshot - September 8, 2026', fill='#62676d', font=font(25))
    draw.rounded_rectangle((64, 287, 1336, 631), radius=16, fill='white', outline='#c8c3b9', width=2)
    draw.text((103, 326), 'ATLAS-409: Sync conflict', fill='#a84226', font=font(43))
    draw.text((103, 399), 'Two people edited the same document.', fill='#182331', font=font(32))
    draw.text((103, 451), 'Review the change history before retrying sync.', fill='#182331', font=font(32))
    draw.rounded_rectangle((103, 526, 421, 593), radius=8, fill='#182331')
    draw.text((129, 543), 'View change history', fill='white', font=font(25))
    draw.text((64, 733), 'No customer files or account details appear in this fixture.', fill='#62676d', font=font(25))
    image.save(DATA / 'atlas-sync-error.png')


def build_scan():
    image = Image.new('RGB', (1400, 1700), '#eeece5')
    draw = ImageDraw.Draw(image)
    draw.text((100, 115), 'PROJECT ATLAS', fill='#333333', font=font(50))
    draw.text((100, 198), 'Rollback rehearsal checklist', fill='#333333', font=font(44))
    draw.text((100, 284), 'Synthetic scanned worksheet / September 8, 2026', fill='#555555', font=font(27))
    draw.line((100, 347, 1300, 347), fill='#777777', width=3)
    lines = [
        ('Record code: RBR-17', 417),
        ('Rehearsal owner: Omar Chen', 494),
        ('Required before launch:', 650),
        ('Attach the incident log to the rehearsal record.', 728),
        ('Record the restore result and rollback duration.', 806),
        ('Obtain the launch owner\'s review.', 884),
        ('Completion status: not recorded on this sheet.', 1082),
        ('An unchecked checklist is not proof of completion.', 1155),
    ]
    for text, y in lines:
        draw.text((100, y), text, fill='#333333', font=font(35))
    draw.line((100, 1450, 1300, 1450), fill='#777777', width=2)
    draw.text((100, 1486), 'Atlas workshop / support packet / 1 of 1', fill='#555555', font=font(26))
    image.rotate(-0.35, resample=Image.Resampling.BICUBIC, fillcolor='#eeece5').save(DATA / 'atlas-rollback-checklist.png')


if __name__ == '__main__':
    DATA.mkdir(exist_ok=True)
    build_pdf()
    build_screenshot()
    build_scan()
    print('Created three synthetic Atlas media fixtures.')
