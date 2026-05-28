"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Sparkles, XCircle } from "lucide-react";
import { POOL_CATEGORIES } from "@arcfundpool/config";
import { createPoolSchema, type CreatePoolInput } from "@arcfundpool/validation";
import { arcFundPoolAbi } from "@arcfundpool/web3";
import { decodeEventLog, getAddress, type Hash } from "viem";
import { PoolProgress } from "@/components/PoolProgress";
import { StatusBadge } from "@/components/StatusBadge";
import { ErrorState } from "@/components/ErrorState";
import { AddArcNetworkButton } from "@/features/network/components/AddArcNetworkButton";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { getOnchainConfig, getWalletClient, parseUSDCAmount, userFacingError, waitForReceipt } from "@/lib/onchain";

const initialForm: CreatePoolInput = {
  title: "",
  description: "",
  targetAmount: 0,
  deadline: "",
  category: "Open Source",
  imageUrl: "",
  externalLink: ""
};

const txStates = ["Waiting for wallet confirmation", "Creating pool", "Pool created successfully", "Failed transaction"];

export function CreatePoolForm() {
  const router = useRouter();
  const { address, chainId, connect, isConnected, provider } = useWallet();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CreatePoolInput>(initialForm);
  const [txState, setTxState] = useState(0);
  const [txHash, setTxHash] = useState<Hash>();
  const [createdPoolUrl, setCreatedPoolUrl] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const [stepError, setStepError] = useState<string>();
  const parsed = useMemo(() => createPoolSchema.safeParse(form), [form]);
  const validationIssue = !parsed.success ? parsed.error.issues[0] : undefined;
  const config = getOnchainConfig();
  const wrongNetwork = isConnected && chainId !== undefined && chainId !== config.chainId;
  const canSubmit = isConnected && !wrongNetwork && config.canWrite && parsed.success;

  function update<K extends keyof CreatePoolInput>(key: K, value: CreatePoolInput[K]) {
    setStepError(undefined);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function stepForField(field?: string) {
    if (field === "title" || field === "description" || field === "category") return 0;
    if (field === "targetAmount" || field === "deadline") return 1;
    return 2;
  }

  function focusValidationField() {
    setStep(stepForField(String(validationIssue?.path[0] ?? "")));
  }

  function firstIssueForStep(stepIndex: number) {
    if (parsed.success) return undefined;
    return parsed.error.issues.find((issue) => stepForField(String(issue.path[0] ?? "")) === stepIndex);
  }

  function continueFromStep() {
    const issue = firstIssueForStep(step);
    if (issue) {
      setStepError(issue.message);
      return;
    }

    setStepError(undefined);
    setStep((value) => Math.min(2, value + 1));
  }

  async function submitCreatePool() {
    setSubmitError(undefined);
    setCreatedPoolUrl(undefined);

    if (!isConnected) {
      await connect();
      return;
    }

    if (!config.canWrite || !config.contractAddress) {
      setSubmitError(`Contract config is missing: ${config.missing.join(", ")}.`);
      return;
    }

    if (wrongNetwork) {
      setSubmitError("Switch your wallet to Arc Testnet before creating a pool.");
      return;
    }

    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message ?? "Review the pool details before creating.");
      return;
    }

    if (!provider || !address) {
      setSubmitError("Connect a wallet before creating a pool on Arc Testnet.");
      return;
    }

    try {
      setTxState(0);
      const walletClient = getWalletClient(provider);
      const deadline = BigInt(Math.floor(new Date(parsed.data.deadline).getTime() / 1000));
      const metadataURI = parsed.data.externalLink || parsed.data.imageUrl || "";
      const hash = await walletClient.writeContract({
        account: getAddress(address),
        address: config.contractAddress,
        abi: arcFundPoolAbi,
        functionName: "createPool",
        args: [parsed.data.title, metadataURI, parseUSDCAmount(String(parsed.data.targetAmount), config.usdcDecimals), deadline]
      });

      setTxHash(hash);
      setTxState(1);
      const receipt = await waitForReceipt(hash);
      setTxState(receipt.status === "success" ? 2 : 3);

      const createdLog = receipt.logs
        .map((log) => {
          try {
            return decodeEventLog({ abi: arcFundPoolAbi, data: log.data, topics: log.topics });
          } catch {
            return null;
          }
        })
        .find((log) => log?.eventName === "PoolCreated");

      const poolId = createdLog?.eventName === "PoolCreated" ? createdLog.args.poolId : undefined;
      console.warn("[ArcFundPool] PoolCreated transaction confirmed", {
        txHash: hash,
        poolId: poolId?.toString()
      });
      setCreatedPoolUrl(poolId !== undefined ? `/pool/${poolId.toString()}` : "/explore");
      router.refresh();
    } catch (error) {
      setTxState(3);
      setSubmitError(userFacingError(error));
    }
  }

  return (
    <div className="mt-6 grid min-w-0 gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-6">
      <div className="card p-4 sm:p-5 md:p-6">
        <div className="mb-5 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStep(item)}
              className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold ${item <= step ? "border-blue-300/25 bg-blue-400/12 text-white" : "border-white/10 bg-white/[0.025] text-[var(--muted)]"}`}
            >
              {item === 0 ? "Details" : item === 1 ? "Funding" : "Review"}
            </button>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <Field label="Pool title" required value={form.title} onChange={(value) => update("title", value)} placeholder="Open-source builder sprint" error={!form.title ? "A clear pool title is required." : undefined} />
            <label className="block">
              <span className="text-sm font-medium text-white">Funding description <span className="text-amber-100">required</span></span>
              <textarea
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Explain what the pool funds and how progress will be reported."
                className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none focus:border-blue-300/50"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-white">Category <span className="text-amber-100">required</span></span>
              <select
                value={form.category}
                onChange={(event) => update("category", event.target.value as CreatePoolInput["category"])}
                className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#0d1d33] px-4 text-white outline-none"
              >
                {POOL_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            {stepError && <StepValidationButton message={stepError} onClick={() => setStep(step)} />}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Field label="Target amount in USDC" required value={String(form.targetAmount || "")} onChange={(value) => update("targetAmount", Number(value))} placeholder="25000" type="number" error={Number(form.targetAmount) <= 0 ? "Enter a USDC target greater than zero." : undefined} />
            <Field label="Deadline" required value={form.deadline} onChange={(value) => update("deadline", value)} type="date" error={form.deadline && new Date(form.deadline).getTime() <= Date.now() ? "Choose a future deadline." : undefined} />
            {stepError && <StepValidationButton message={stepError} onClick={() => setStep(step)} />}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Optional image URL" value={form.imageUrl ?? ""} onChange={(value) => update("imageUrl", value)} placeholder="https://..." />
            <Field label="Optional external link" value={form.externalLink ?? ""} onChange={(value) => update("externalLink", value)} placeholder="https://project.example" />
            {!isConnected && <ErrorState message="Connect a wallet before creating a pool on Arc Testnet." />}
            {wrongNetwork && (
              <div className="space-y-3 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4">
                <ErrorState message="Switch your wallet to Arc Testnet before creating a pool." />
                <AddArcNetworkButton label="Add / Switch to Arc Testnet" />
              </div>
            )}
            {!config.canWrite && <ErrorState message={`Live write config is missing: ${config.missing.join(", ")}.`} />}
            {validationIssue && (
              <button
                type="button"
                onClick={focusValidationField}
                onFocus={focusValidationField}
                className="flex w-full items-start gap-3 rounded-3xl border border-rose-400/25 bg-rose-400/10 p-4 text-left text-sm text-rose-100"
              >
                <AlertTriangle className="mt-0.5 shrink-0" size={18} />
                <span>{validationIssue.message ?? "Review the pool details before creating."}</span>
              </button>
            )}
            {submitError && <ErrorState message={submitError} />}
            {createdPoolUrl && (
              <a href={createdPoolUrl} className="tap-target flex items-center justify-center rounded-full bg-emerald-400 px-5 py-3 font-semibold text-slate-950">
                View created pool
              </a>
            )}
            {txHash && <p className="truncate text-xs text-[var(--muted)]" title={txHash}>Transaction: {txHash}</p>}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
            className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 font-semibold text-white disabled:opacity-40"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          {step < 2 ? (
            <button
              type="button"
              onClick={continueFromStep}
              className="tap-target inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2 font-semibold text-white"
            >
              Continue
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={submitCreatePool}
              disabled={!canSubmit}
              className="tap-target inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white disabled:opacity-45"
            >
              Create Pool on Arc
            </button>
          )}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card overflow-hidden p-5">
          <div className="-mx-5 -mt-5 mb-5 flex items-center gap-2 bg-[linear-gradient(90deg,rgba(39,117,202,0.18),rgba(55,213,255,0.08))] px-5 py-4 text-sm font-semibold text-cyan-100">
            <Sparkles size={17} />
            Live contributor preview
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cyan)]">{form.category}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{form.title || "Pool title preview"}</h2>
            </div>
            <StatusBadge status="active" />
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{form.description || "Describe what the USDC pool funds, who maintains it, and how progress will be reported."}</p>
          <div className="mt-5">
            <PoolProgress raised={0} target={Number(form.targetAmount) || 1} />
          </div>
        </div>
        <div className="card p-5">
          <p className="font-semibold text-white">Transaction state</p>
          <div className="mt-4 space-y-3">
            {txStates.map((state, index) => (
              <div key={state} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                {index < 2 && index === txState ? <Loader2 className="animate-spin text-cyan-200" size={18} /> : index === 2 ? <CheckCircle2 className="text-emerald-300" size={18} /> : index === 3 ? <XCircle className="text-rose-300" size={18} /> : <span className="size-[18px] rounded-full border border-white/15" />}
                <span className={index === txState ? "text-white" : ""}>{state}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function StepValidationButton({ message, onClick }: { message: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onFocus={onClick}
      className="flex w-full items-start gap-3 rounded-3xl border border-rose-400/25 bg-rose-400/10 p-4 text-left text-sm text-rose-100"
    >
      <AlertTriangle className="mt-0.5 shrink-0" size={18} />
      <span>{message}</span>
    </button>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", error, required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; error?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white">{label}{required && <span className="text-amber-100"> required</span>}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-300/50"
      />
      {error && <span className="mt-2 block text-xs text-amber-100">{error}</span>}
    </label>
  );
}
