import { PrismaClient } from '@prisma/client';

const rokuyo = [
  {
    name: '先勝',
    kana: 'せんしょう/せんかち',
  },
  {
    name: '友引',
    kana: 'ともびき',
  },
  {
    name: '先負',
    kana: 'せんぷ/せんぶ/せんまけ',
  },
  {
    name: '仏滅',
    kana: 'ぶつめつ',
  },
  {
    name: '大安',
    kana: 'たいあん',
  },
  {
    name: '赤口',
    kana: 'しゃっこう/しゃっく',
  },
];

const prisma = new PrismaClient();

async function main() {
  for (const rky of rokuyo) {
    await prisma.rokuyo.create({
      data: {
        name: rky.name,
        kana: rky.kana,
        note: '',
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
