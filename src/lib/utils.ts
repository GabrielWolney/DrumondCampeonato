/**
 * Formata um número para moeda brasileira (BRL)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada (ex: R$ 199,90)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Normaliza texto para busca (remove acentos, caixa baixa, trim)
 * @param text - Texto original
 * @returns Texto normalizado
 */
export function normalizeText(text: string): string {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Função para concatenar classes CSS condicionalmente (utilitário do Tailwind)
 * @param inputs - Classes CSS ou objetos condicionais
 * @returns String de classes
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Formata uma data para o formato brasileiro
 * @param date - Objeto Date ou string ISO
 * @returns Data formatada (ex: 15 de Novembro de 2026)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Retorna o status do lote de ingressos
 * @param sold - Quantidade vendida
 * @param total - Quantidade total disponível
 * @returns Objeto com status, texto e cor
 */
export function getTicketStatus(sold: number, total: number) {
  const available = total - sold;
  const percentage = (sold / total) * 100;

  if (available === 0) {
    return { status: "esgotado", text: "Esgotado", color: "text-red-400" };
  }
  if (percentage >= 80) {
    return { status: "ultimos", text: "Últimas unidades", color: "text-orange-400" };
  }
  return { status: "disponivel", text: "Disponível", color: "text-green-400" };
}

/**
 * Delay assíncrono (útil para debounce ou mock)
 * @param ms - Milissegundos
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));