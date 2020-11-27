import { PrismaClient } from '@prisma/client';

const months = [
  {
    month: 1,
    name: '睦月',
    kana: 'むつき',
  },
  {
    month: 2,
    name: '如月',
    kana: 'きさらぎ',
  },
  {
    month: 3,
    name: '弥生',
    kana: 'やよい',
  },
  {
    month: 4,
    name: '卯月',
    kana: 'うづき',
  },
  {
    month: 5,
    name: '皐月',
    kana: 'さつき',
  },
  {
    month: 6,
    name: '水無月',
    kana: 'みなづき',
  },
  {
    month: 7,
    name: '文月',
    kana: 'ふづき',
  },
  {
    month: 8,
    name: '葉月',
    kana: 'はつき',
  },
  {
    month: 9,
    name: '長月',
    kana: 'ながつき',
  },
  {
    month: 10,
    name: '神無月',
    kana: 'かんなづき',
  },
  {
    month: 11,
    name: '霜月',
    kana: 'しもつき',
  },
  {
    month: 12,
    name: '師走',
    kana: 'しわす',
  },
];

const prisma = new PrismaClient();

async function main() {
  for (const month of months) {
    await prisma.month.create({
      data: {
        month: month.month,
        name: month.name,
        kana: month.kana,
      },
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
