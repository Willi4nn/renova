import 'dotenv/config';
import { ServiceStatus } from '../generated/prisma/client.js';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  console.log('🌱 Iniciando seed...');

  await prisma.service.deleteMany();
  await prisma.client.deleteMany();

  const client1 = await prisma.client.create({
    data: {
      name: 'João Silva',
      address: 'Rua das Flores, 123 - Centro',
      phone_number: '34999991111',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Maria Oliveira',
      address: 'Av. Brasil, 500 - Ap 202',
      phone_number: '34888882222',
    },
  });

  await prisma.service.createMany({
    data: [
      {
        client_id: client1.id,
        furniture_name: 'Sofá 3 Lugares',
        fabric_name: 'Linho Cinza',
        fabric_code: 'LN-042',
        fabric_price_per_meter: 45.0,
        fabric_meters: 12.5,
        cost_fabric: 562.5,
        cost_foam: 200.0,
        cost_labor: 800.0,
        cost_shipping: 100.0,
        cost_other: 50.0,
        total_cost: 1712.5,
        final_price: 2800.0,
        net_profit: 1087.5,
        collection_date: new Date('2025-12-20'),
        delivery_date: new Date('2026-01-05'),
        status: ServiceStatus.IN_PROGRESS,
        notes: 'Cliente pediu para reforçar as percintas.',
      },
      {
        client_id: client2.id,
        furniture_name: 'Poltrona',
        fabric_name: 'Suede Azul',
        fabric_code: 'SD-10',
        fabric_price_per_meter: 32.0,
        fabric_meters: 4.0,
        cost_fabric: 128.0,
        cost_foam: 80.0,
        cost_labor: 350.0,
        cost_shipping: 50.0,
        cost_other: 20.0,
        total_cost: 628.0,
        final_price: 1100.0,
        net_profit: 472.0,
        collection_date: new Date('2025-12-26'),
        status: ServiceStatus.IN_PROGRESS,
        notes: 'Trocar pés de madeira por metal.',
      },
    ],
  });

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
