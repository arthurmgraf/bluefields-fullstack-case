import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  const email = 'demo@startuptracker.app';
  const password = 'senha123';

  console.log('1. Checking for existing demo user...');
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError.message);
    process.exit(1);
  }

  const existingUser = users.users.find(u => u.email === email);
  if (existingUser) {
    console.log(`User ${email} found (ID: ${existingUser.id}). Deleting...`);
    // Before deleting user, delete their startups to satisfy foreign key constraints
    const { error: delStartupsError } = await supabase
      .from('startups')
      .delete()
      .eq('responsible_id', existingUser.id);
      
    if (delStartupsError) console.log('Notice: Failed to delete existing startups (may not exist)', delStartupsError.message);

    const { error: delError } = await supabase.auth.admin.deleteUser(existingUser.id);
    if (delError) {
      console.error('Error deleting user:', delError.message);
      process.exit(1);
    }
    console.log('Deleted successfully.');
  }

  console.log(`2. Creating demo user ${email}...`);
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Demo User' }
  });

  if (createError || !newUser.user) {
    console.error('Error creating user:', createError?.message);
    process.exit(1);
  }

  const userId = newUser.user.id;
  console.log(`Created successfully. User ID: ${userId}`);

  console.log('3. Waiting for profile trigger to complete...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('4. Seeding startups...');
  const startupsToInsert = [
    { name: 'AgroPulse',     segment: 'Agtech',      phase: 'traction',   risk_level: 'green',  responsible_id: userId, description: 'Plataforma SaaS de monitoramento agrícola via satélite para pequenos produtores.', founded_at: '2023-03-10' },
    { name: 'CuidaJá',       segment: 'Healthtech',  phase: 'validation', risk_level: 'yellow', responsible_id: userId, description: 'Marketplace de cuidadores domiciliares com triagem clínica integrada.',         founded_at: '2024-01-22' },
    { name: 'Trilha',        segment: 'Edtech',      phase: 'traction',   risk_level: 'green',  responsible_id: userId, description: 'Plataforma adaptativa de preparação para o ENEM em vídeo curto.',                founded_at: '2022-11-05' },
    { name: 'Bagagem Limpa', segment: 'Foodtech',    phase: 'ideation',   risk_level: 'red',    responsible_id: userId, description: 'Logística reversa de embalagens de delivery em São Paulo.',                     founded_at: '2025-02-14' },
    { name: 'Fluxo Caixa',   segment: 'Fintech',     phase: 'scale',      risk_level: 'green',  responsible_id: userId, description: 'ERP financeiro para microempresas brasileiras com conciliação automática.',     founded_at: '2021-06-18' },
    { name: 'Morada+',       segment: 'Proptech',    phase: 'validation', risk_level: 'yellow', responsible_id: userId, description: 'Aluguel sem fiador com seguro embutido para classes C/D.',                      founded_at: '2024-04-30' },
    { name: 'SeguraBem',     segment: 'Insurtech',   phase: 'ideation',   risk_level: 'green',  responsible_id: userId, description: 'Microsseguros parametrizados para autônomos de aplicativos.',                   founded_at: '2025-01-08' },
    { name: 'LogTech BR',    segment: 'Logtech',     phase: 'traction',   risk_level: 'red',    responsible_id: userId, description: 'Roteirização de last-mile usando ML para transportadoras regionais.',           founded_at: '2023-09-12' }
  ];

  const { data: insertedStartups, error: insertError } = await supabase
    .from('startups')
    .insert(startupsToInsert)
    .select('id, name, risk_level');

  if (insertError) {
    console.error('Error seeding startups:', insertError.message);
    process.exit(1);
  }
  console.log(`Inserted ${insertedStartups.length} startups.`);

  console.log('5. Seeding startup updates...');
  const updatesToInsert = insertedStartups.map(startup => {
    let content = '', blockers = '', next_steps = '';

    switch (startup.name) {
      case 'AgroPulse': content = 'Fechamos contrato com cooperativa em GO. Receita recorrente cresceu 40% MoM.'; break;
      case 'CuidaJá': content = 'PMF inicial em SP — 18 cuidadoras ativas. Churn alto após primeiro mês.'; break;
      case 'Trilha': content = 'Lançamento da v2 com IA de revisão. NPS subiu de 42 para 67.'; break;
      case 'Bagagem Limpa': content = 'Custo logístico maior que receita. Avaliando pivô para B2B com restaurantes.'; break;
      case 'Fluxo Caixa': content = '50k microempresas ativas. Series A liderada por fundo regional fechado.'; break;
      case 'Morada+': content = 'Parceria com seguradora travou na compliance. Buscando alternativa.'; break;
      case 'SeguraBem': content = 'Validação inicial promissora — 200 entregadores em waitlist.'; break;
      case 'LogTech BR': content = 'Cliente âncora cancelou. Runway de 3 meses. Em conversa com investidor-anjo.'; break;
    }

    switch (startup.risk_level) {
      case 'red': blockers = 'Caixa apertado / pivô em discussão'; next_steps = 'Decisão sobre pivô em 14 dias; conversar com 3 investidores'; break;
      case 'yellow': blockers = 'Tração lenta / contratação travada'; next_steps = 'Repensar funil; rever ICP'; break;
      default: blockers = ''; next_steps = 'Manter execução; próximo ritual mensal'; break;
    }

    return {
      startup_id: startup.id,
      author_id: userId,
      content,
      blockers,
      next_steps,
      risk_level: startup.risk_level
    };
  });

  const { error: updateError } = await supabase
    .from('startup_updates')
    .insert(updatesToInsert);

  if (updateError) {
    console.error('Error seeding updates:', updateError.message);
    process.exit(1);
  }

  console.log('Inserted startup updates.');
  console.log('\n✅ ALL DONE! The database is seeded and ready.');
  console.log(`👉 You can now log in with Email: ${email} and Password: ${password}`);
}

main().catch(console.error);
