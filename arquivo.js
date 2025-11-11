// Seleciona o formulário e o botão
const form = document.getElementById("formCadastro");
const btn = document.getElementById("btnCriar");

// 🔹 Máscara automática para o CPF
document.getElementById("cpf").addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = value;
});

// 🔹 Função que valida cada campo individualmente
function validarCampo(campo) {
  const valor = document.getElementById(campo).value.trim();
  const msg = document.getElementById("resp" + campo);
  let valido = false;

  switch (campo) {
    case "nome":
      valido = valor.length >= 5 && valor.includes(" ");
      msg.textContent = valido ? "" : "Digite nome e sobrenome (mínimo 5 letras).";
      break;

    case "email":
      valido = /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(valor);
      msg.textContent = valido ? "" : "E-mail inválido.";
      break;

    case "senha":
      valido = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(valor);
      msg.textContent = valido ? "" : "Senha fraca. Use maiúscula, minúscula, número e símbolo.";
      break;

    case "confsenha":
      const senha = document.getElementById("senha").value;
      valido = valor === senha && valor !== "";
      msg.textContent = valido ? "" : "As senhas não coincidem.";
      break;

    case "cpf":
      valido = validarCPF(valor);
      msg.textContent = valido ? "" : "CPF inválido.";
      break;

    case "nascimento":
      const data = new Date(valor);
      const hoje = new Date();
      let idade = hoje.getFullYear() - data.getFullYear();
      const m = hoje.getMonth() - data.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < data.getDate())) idade--;
      valido = idade >= 18;
      msg.textContent = valido ? "" : "Você deve ter mais de 18 anos.";
      break;
  }

  // Adiciona classes visuais de erro/sucesso
  const input = document.getElementById(campo);
  if (valido) {
    input.classList.remove("erro");
    input.classList.add("valido");
  } else {
    input.classList.add("erro");
    input.classList.remove("valido");
  }

  return valido;
}

// 🔹 Validação real do CPF (algoritmo oficial)
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = 11 - (soma % 11);
  if (resto >= 10) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = 11 - (soma % 11);
  if (resto >= 10) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

// 🔹 Quando o usuário digita, valida o campo em tempo real
form.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", () => validarCampo(input.id));
});

// 🔹 Quando clica em "Criar Conta"
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita recarregar a página

  // Verifica todos os campos
  const campos = ["nome", "email", "senha", "confsenha", "cpf", "nascimento"];
  const todosValidos = campos.every(c => validarCampo(c));
  const termos = document.getElementById("termos").checked;

  if (!termos) {
    document.getElementById("resptermos").textContent = "Você deve aceitar os termos.";
  } else {
    document.getElementById("resptermos").textContent = "";
  }

  // Se tudo estiver válido, mostra sucesso
  if (todosValidos && termos) {
    alert("Conta criada com sucesso!");
    form.reset();

    // Remove cores de validação
    form.querySelectorAll("input").forEach(i => {
      i.classList.remove("valido", "erro");
    });
  } else {
    alert("Verifique os campos destacados em vermelho.");
  }
});
