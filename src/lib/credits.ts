export const CREDIT_PACKAGES = [
  { id: 'basic', credits: 10, amount: 100, description: 'Basic Package' },
  { id: 'pro', credits: 50, amount: 500, description: 'Pro Package' },
  { id: 'premium', credits: 100, amount: 1000, description: 'Premium Package' },
] as const;

export function getCreditPackage(id: string) {
  return CREDIT_PACKAGES.find(pkg => pkg.id === id);
}