export const brazilianStates = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' },
];

export const brazilianCities: { [key: string]: string[] } = {
  'AC': [
    'Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó',
    'Brasileia', 'Plácido de Castro', 'Xapuri', 'Senador Guiomard', 'Epitaciolândia'
  ],
  'AL': [
    'Maceió', 'Arapiraca', 'Palmeira dos Índios', 'Rio Largo', 'Penedo',
    'União dos Palmares', 'São Miguel dos Campos', 'Santana do Ipanema', 'Delmiro Gouveia', 'Coruripe'
  ],
  'AP': [
    'Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Mazagão',
    'Porto Grande', 'Tartarugalzinho', 'Vitória do Jari', 'Ferreira Gomes', 'Pedra Branca do Amapari'
  ],
  'AM': [
    'Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari',
    'Tefé', 'Tabatinga', 'Maués', 'São Gabriel da Cachoeira', 'Humaitá'
  ],
  'BA': [
    'Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro',
    'Itabuna', 'Lauro de Freitas', 'Ilhéus', 'Jequié', 'Teixeira de Freitas',
    'Alagoinhas', 'Porto Seguro', 'Simões Filho', 'Paulo Afonso', 'Eunápolis'
  ],
  'CE': [
    'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral',
    'Crato', 'Itapipoca', 'Maranguape', 'Iguatu', 'Quixadá',
    'Canindé', 'Aquiraz', 'Pacatuba', 'Crateús', 'Russas'
  ],
  'DF': [
    'Brasília', 'Gama', 'Taguatinga', 'Ceilândia', 'Sobradinho',
    'Planaltina', 'Paranoá', 'Núcleo Bandeirante', 'Riacho Fundo', 'Samambaia'
  ],
  'ES': [
    'Vitória', 'Vila Velha', 'Cariacica', 'Serra', 'Cachoeiro de Itapemirim',
    'Linhares', 'São Mateus', 'Colatina', 'Guarapari', 'Aracruz'
  ],
  'GO': [
    'Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia',
    'Águas Lindas de Goiás', 'Valparaíso de Goiás', 'Trindade', 'Formosa', 'Novo Gama'
  ],
  'MA': [
    'São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias',
    'Codó', 'Paço do Lumiar', 'Açailândia', 'Bacabal', 'Balsas'
  ],
  'MT': [
    'Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra',
    'Cáceres', 'Sorriso', 'Lucas do Rio Verde', 'Barra do Garças', 'Primavera do Leste'
  ],
  'MS': [
    'Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã',
    'Naviraí', 'Nova Andradina', 'Sidrolândia', 'Maracaju', 'Aquidauana'
  ],
  'MG': [
    'Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim',
    'Montes Claros', 'Ribeirão das Neves', 'Uberaba', 'Governador Valadares', 'Ipatinga',
    'Sete Lagoas', 'Divinópolis', 'Santa Luzia', 'Ibirité', 'Poços de Caldas',
    'Patos de Minas', 'Pouso Alegre', 'Teófilo Otoni', 'Barbacena', 'Sabará'
  ],
  'PA': [
    'Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas',
    'Castanhal', 'Abaetetuba', 'Cametá', 'Bragança', 'Marituba'
  ],
  'PB': [
    'João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux',
    'Sousa', 'Cajazeiras', 'Cabedelo', 'Guarabira', 'Mamanguape'
  ],
  'PR': [
    'Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel',
    'São José dos Pinhais', 'Foz do Iguaçu', 'Colombo', 'Guarapuava', 'Paranaguá',
    'Araucária', 'Toledo', 'Apucarana', 'Pinhais', 'Campo Largo'
  ],
  'PE': [
    'Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina',
    'Paulista', 'Cabo de Santo Agostinho', 'Camaragibe', 'Garanhuns', 'Vitória de Santo Antão'
  ],
  'PI': [
    'Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano',
    'Campo Maior', 'Barras', 'Altos', 'Pedro II', 'Valença do Piauí'
  ],
  'RJ': [
    'Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói',
    'Belford Roxo', 'Campos dos Goytacazes', 'São João de Meriti', 'Petrópolis', 'Volta Redonda',
    'Magé', 'Macaé', 'Itaboraí', 'Cabo Frio', 'Angra dos Reis',
    'Nova Friburgo', 'Barra Mansa', 'Teresópolis', 'Mesquita', 'Nilópolis'
  ],
  'RN': [
    'Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba',
    'Ceará-Mirim', 'Caicó', 'Assu', 'Currais Novos', 'Santa Cruz'
  ],
  'RS': [
    'Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria',
    'Gravataí', 'Viamão', 'Novo Hamburgo', 'São Leopoldo', 'Rio Grande',
    'Alvorada', 'Passo Fundo', 'Sapucaia do Sul', 'Uruguaiana', 'Santa Cruz do Sul'
  ],
  'RO': [
    'Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal',
    'Rolim de Moura', 'Guajará-Mirim', 'Jaru', 'Ouro Preto do Oeste', 'Buritis'
  ],
  'RR': [
    'Boa Vista', 'Rorainópolis', 'Caracaraí', 'Alto Alegre', 'Mucajaí',
    'Cantá', 'Bonfim', 'Normandia', 'São João da Baliza', 'São Luiz'
  ],
  'SC': [
    'Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Criciúma',
    'Chapecó', 'Itajaí', 'Lages', 'Palhoça', 'Balneário Camboriú',
    'Brusque', 'Tubarão', 'São Bento do Sul', 'Caçador', 'Camboriú'
  ],
  'SP': [
    'São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André',
    'Osasco', 'Ribeirão Preto', 'Sorocaba', 'Mauá', 'São José dos Campos',
    'Mogi das Cruzes', 'Diadema', 'Jundiaí', 'Carapicuíba', 'Piracicaba',
    'Bauru', 'São Vicente', 'Franca', 'Guarujá', 'Taubaté',
    'Praia Grande', 'Limeira', 'Suzano', 'Taboão da Serra', 'Sumaré',
    'Porto Ferreira', 'Pirassununga', 'Araraquara', 'São Carlos', 'Americana',
    'Rio Claro', 'Presidente Prudente', 'São José do Rio Preto', 'Araçatuba',
    'Marília', 'Jacareí', 'Indaiatuba', 'Cotia', 'Itaquaquecetuba',
    'Embu das Artes', 'Tatuí', 'Itapevi', 'Hortolândia', 'Itu',
    'Ferraz de Vasconcelos', 'Bragança Paulista', 'Pindamonhangaba', 'Francisco Morato',
    'Itapecerica da Serra', 'Jaú', 'Botucatu', 'Atibaia', 'Araras',
    'Cubatão', 'Santana de Parnaíba', 'Sertãozinho', 'Valinhos', 'Ourinhos'
  ],
  'SE': [
    'Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'São Cristóvão',
    'Estância', 'Tobias Barreto', 'Simão Dias', 'Propriá', 'Canindé de São Francisco'
  ],
  'TO': [
    'Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins',
    'Colinas do Tocantins', 'Guaraí', 'Tocantinópolis', 'Miracema do Tocantins', 'Dianópolis'
  ],
};

export const getCitiesByState = (stateCode: string): string[] => {
  return brazilianCities[stateCode] || [];
};

export const getStateByCode = (code: string) => {
  return brazilianStates.find(state => state.code === code);
};

export const formatCEP = (cep: string): string => {
  const numbers = cep.replace(/\D/g, '');
  if (numbers.length <= 5) {
    return numbers;
  }
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

export const formatPhone = (phone: string): string => {
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length <= 2) {
    return `(${numbers}`;
  }
  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export const formatCNPJ = (cnpj: string): string => {
  const numbers = cnpj.replace(/\D/g, '');
  if (numbers.length <= 2) {
    return numbers;
  }
  if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  }
  if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  }
  if (numbers.length <= 12) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  }
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
};

export const fetchAddressByCEP = async (cep: string) => {
  try {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();

    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      address: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      cep: data.cep || '',
    };
  } catch (error) {
    throw new Error('Erro ao buscar CEP');
  }
};

export const formatCPF = (cpf: string): string => {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length <= 3) {
    return numbers;
  }
  if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  }
  if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  }
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

export const validateCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, '');

  if (numbers.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(numbers)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.substring(10, 11))) return false;

  return true;
};

export const validateCNPJ = (cnpj: string): boolean => {
  const numbers = cnpj.replace(/\D/g, '');

  if (numbers.length !== 14) return false;

  if (/^(\d)\1{13}$/.test(numbers)) return false;

  let size = numbers.length - 2;
  let digits = numbers.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  digits = numbers.substring(size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  return true;
};