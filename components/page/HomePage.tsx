"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  RotateCcw,
  Settings2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { FolderDropzone } from "@/components/FolderDropzone";
import { ProgressBar } from "@/components/ProgressBar";
import { FileResultsTable } from "@/components/FileResultsTable";
import Logo from "@/components/ui/logo";
import { useWebpocalypse } from "@/hooks/useWebpocalypse";

export function HomePage() {
  const {
    files,
    settings,
    progress,
    statsDisplay,
    fileResults,
    downloadUrl,
    isProcessing,
    canConvert,
    handleFilesChange,
    handleQualityChange,
    handleFormatChange,
    handleLosslessChange,
    handleResizeChange,
    handleMaxWidthChange,
    handleMaxHeightChange,
    handleConvert,
    handleDownload,
    handleAgain,
  } = useWebpocalypse();

  const [settingsOpen, setSettingsOpen] = useState(false);

  const showIdleState = progress.status === "idle";
  const showCompletedState = progress.status === "complete";

  // Auto-close settings panel whenever we leave the idle state
  useEffect(() => {
    if (!showIdleState) setSettingsOpen(false);
  }, [showIdleState]);

  // Compact settings summary shown on the settings trigger pill
  const settingsSummary = [
    settings.outputFormat === "both"
      ? "WebP+AVIF"
      : settings.outputFormat.toUpperCase(),
    settings.lossless ? "Lossless" : `${settings.quality}%`,
    settings.resize && (settings.maxWidth || settings.maxHeight)
      ? [
          settings.maxWidth ? `${settings.maxWidth}w` : null,
          settings.maxHeight ? `${settings.maxHeight}h` : null,
        ]
          .filter(Boolean)
          .join("×")
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="relative bg-background min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(/images/background.jpg)` }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/50" />

      <div className="z-10 relative flex flex-col min-h-screen">
        <header className="flex justify-between items-center px-6 py-4">
          <Logo
            src="/images/webpocalypse-secondary.svg"
            alt="Webpocalypse"
            width={24}
            height={24}
            title="Webpocalypse"
          />
        </header>

        <div className="flex flex-1 items-center px-4 sm:px-6 py-6">
          <div className="flex lg:flex-row flex-col justify-start items-center gap-4 w-full">
            <div className="relative flex flex-col items-center w-full max-w-sm shrink-0">
              {downloadUrl && showCompletedState && (
                <button
                  type="button"
                  onClick={handleAgain}
                  className="inline-flex -top-8 hover:-top-9 z-0 absolute justify-center items-center gap-2 bg-card/90 hover:bg-card shadow-md backdrop-blur-md mx-auto px-4 py-3 border border-border/70 rounded-2xl rounded-b-none min-w-xs font-semibold text-foreground text-xs transition transition-all duration-300 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Again?
                </button>
              )}

              {/* ── Outer card shell — clips the sliding panels ── */}
              <div className="z-10 relative bg-card/95 shadow-xl backdrop-blur-md border border-border/70 rounded-4xl w-full overflow-hidden">
                {showIdleState ? (
                  /*
                   * Two-panel slider. Container is 200% wide; each panel is
                   * 50% of that = exactly the card width. Sliding left by 50%
                   * of the container (= one card width) reveals the settings.
                   */
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                      width: "200%",
                      transform: settingsOpen
                        ? "translateX(-50%)"
                        : "translateX(0)",
                    }}
                  >
                    {/* ── Panel 1 : Main ─────────────────────────────── */}
                    <div className="space-y-3 p-3 sm:p-4 w-1/2">
                      <Card className="bg-card/70 shadow-none border border-border/80 border-dashed">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <span className="inline-flex justify-center items-center bg-primary/15 rounded-full w-7 h-7">
                              <Zap className="w-4 h-4 text-primary" />
                            </span>
                            Add your images
                          </CardTitle>
                          <CardDescription>
                            Drop a folder of JPG / PNG assets or click to
                            browse. Folder structure is preserved.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <FolderDropzone
                            files={files}
                            onFilesChange={handleFilesChange}
                            disabled={isProcessing}
                            className="h-52"
                          />
                        </CardContent>
                      </Card>

                      {/* Settings pill + Convert button */}
                      <div className="flex justify-between items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSettingsOpen(true)}
                          className="flex items-center gap-2 bg-muted/60 hover:bg-muted px-3 py-2 border border-border/50 rounded-xl min-w-0 text-left transition-colors cursor-pointer"
                        >
                          <Settings2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="mb-0.5 font-medium text-[11px] leading-none">
                              Settings
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate leading-none">
                              {settingsSummary}
                            </p>
                          </div>
                        </button>

                        <Button
                          size="lg"
                          onClick={handleConvert}
                          disabled={!canConvert}
                          className="gap-2 shrink-0"
                        >
                          <Zap className="w-4 h-4" />
                          {settings.outputFormat === "webp" &&
                            "Convert to WebP"}
                          {settings.outputFormat === "avif" &&
                            "Convert to AVIF"}
                          {settings.outputFormat === "both" && "WebP + AVIF"}
                        </Button>
                      </div>
                    </div>

                    {/* ── Panel 2 : Settings ─────────────────────────── */}
                    <div className="flex flex-col gap-4 p-3 sm:p-4 w-1/2">
                      {/* Header */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSettingsOpen(false)}
                          className="inline-flex justify-center items-center hover:bg-muted rounded-full w-7 h-7 transition-colors shrink-0"
                          aria-label="Back"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-sm">
                          Conversion Settings
                        </span>
                      </div>

                      {/* Quality */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor="quality"
                            className={`text-xs transition-opacity ${settings.lossless ? "opacity-40" : ""}`}
                          >
                            Quality
                          </Label>
                          <span
                            className={`font-medium tabular-nums text-xs transition-opacity ${settings.lossless ? "opacity-40" : ""}`}
                          >
                            {settings.quality}%
                          </span>
                        </div>
                        <Slider
                          id="quality"
                          min={50}
                          max={100}
                          step={1}
                          value={[settings.quality]}
                          onValueChange={([value]) =>
                            handleQualityChange(value)
                          }
                          disabled={settings.lossless}
                          className={`w-full transition-opacity ${settings.lossless ? "opacity-40 pointer-events-none" : ""}`}
                        />
                        {settings.lossless ? (
                          <p className="text-[11px] text-amber-500/80">
                            Lossless mode ignores quality settings.
                          </p>
                        ) : (
                          <p className="text-[11px] text-muted-foreground">
                            Higher = larger files. 80% recommended.
                          </p>
                        )}
                      </div>

                      {/* Lossless */}
                      <div className="flex justify-between items-center">
                        <Label
                          htmlFor="lossless"
                          className="text-xs cursor-pointer"
                        >
                          Lossless Mode
                        </Label>
                        <Switch
                          id="lossless"
                          checked={settings.lossless}
                          onCheckedChange={handleLosslessChange}
                        />
                      </div>

                      {/* Resize */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor="resize"
                            className="text-xs cursor-pointer"
                          >
                            Resize on Conversion
                          </Label>
                          <Switch
                            id="resize"
                            checked={settings.resize}
                            onCheckedChange={handleResizeChange}
                          />
                        </div>
                        <div
                          className={`space-y-2 transition-opacity ${settings.resize ? "" : "opacity-40 pointer-events-none"}`}
                        >
                          <div className="flex gap-2">
                            <div className="flex-1 space-y-1">
                              <Label
                                htmlFor="maxWidth"
                                className="text-[11px] text-muted-foreground"
                              >
                                Max Width
                              </Label>
                              <div className="relative">
                                <Input
                                  id="maxWidth"
                                  type="number"
                                  min={1}
                                  placeholder="1920"
                                  value={settings.maxWidth ?? ""}
                                  onChange={(e) =>
                                    handleMaxWidthChange(
                                      e.target.value
                                        ? parseInt(e.target.value, 10)
                                        : undefined,
                                    )
                                  }
                                  disabled={!settings.resize}
                                  className="pr-6 h-7 text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
                                />
                                <span className="right-2 absolute inset-y-0 flex items-center text-[10px] text-muted-foreground pointer-events-none">
                                  px
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <Label
                                htmlFor="maxHeight"
                                className="text-[11px] text-muted-foreground"
                              >
                                Max Height
                              </Label>
                              <div className="relative">
                                <Input
                                  id="maxHeight"
                                  type="number"
                                  min={1}
                                  placeholder="1080"
                                  value={settings.maxHeight ?? ""}
                                  onChange={(e) =>
                                    handleMaxHeightChange(
                                      e.target.value
                                        ? parseInt(e.target.value, 10)
                                        : undefined,
                                    )
                                  }
                                  disabled={!settings.resize}
                                  className="pr-6 h-7 text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
                                />
                                <span className="right-2 absolute inset-y-0 flex items-center text-[10px] text-muted-foreground pointer-events-none">
                                  px
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Fits within bounds, preserves aspect ratio, no
                            upscaling.
                          </p>
                        </div>
                      </div>

                      {/* Output format */}
                      <div className="space-y-1.5">
                        <p className="font-medium text-[11px] text-muted-foreground">
                          Output format
                        </p>
                        <div className="flex gap-1">
                          {[
                            { value: "webp", label: "WebP" },
                            { value: "avif", label: "AVIF" },
                            { value: "both", label: "Both" },
                          ].map((option) => (
                            <Button
                              key={option.value}
                              type="button"
                              size="sm"
                              variant={
                                settings.outputFormat === option.value
                                  ? "default"
                                  : "outline"
                              }
                              className="px-2 h-7 text-[11px]"
                              onClick={() =>
                                handleFormatChange(
                                  option.value as typeof settings.outputFormat,
                                )
                              }
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          AVIF often compresses smaller than WebP; use Both for
                          maximum browser coverage.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── Non-idle: progress / complete ─────────────────── */
                  <div className="space-y-3 p-3 sm:p-4">
                    <Card className="bg-card/80 shadow-none border border-border/70">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <span className="inline-flex justify-center items-center bg-primary/15 rounded-full w-7 h-7">
                            {showCompletedState ? (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            ) : (
                              <Spinner className="w-4 h-4 text-primary" />
                            )}
                          </span>
                          {showCompletedState
                            ? "Conversion complete"
                            : "Processing your folder"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ProgressBar progress={progress} />
                      </CardContent>
                    </Card>

                    {statsDisplay && showCompletedState && (
                      <Card className="bg-primary/5 shadow-none border border-primary/30">
                        <CardContent className="pt-4">
                          <div className="gap-3 grid grid-cols-2">
                            <div className="min-w-0 text-center">
                              <p
                                className="font-bold tabular-nums text-lg sm:text-xl truncate leading-tight whitespace-nowrap"
                                title={statsDisplay.totalFiles}
                              >
                                {statsDisplay.totalFiles}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Images Converted
                              </p>
                            </div>
                            <div className="min-w-0 text-center">
                              <p
                                className="font-bold tabular-nums text-lg sm:text-xl truncate leading-tight whitespace-nowrap"
                                title={statsDisplay.totalOriginalSize}
                              >
                                {statsDisplay.totalOriginalSize}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Original Size
                              </p>
                            </div>
                            <div className="min-w-0 text-center">
                              <p
                                className="font-bold tabular-nums text-lg sm:text-xl truncate leading-tight whitespace-nowrap"
                                title={statsDisplay.totalConvertedSize}
                              >
                                {statsDisplay.totalConvertedSize}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                New Size
                              </p>
                            </div>
                            <div className="min-w-0 text-center">
                              <p
                                className="font-bold tabular-nums text-primary text-lg sm:text-xl truncate leading-tight whitespace-nowrap"
                                title={statsDisplay.savedPercentage}
                              >
                                {statsDisplay.savedPercentage}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Space Saved
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex justify-end">
                      {downloadUrl && showCompletedState ? (
                        <Button
                          size="lg"
                          onClick={handleDownload}
                          className="gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground whitespace-nowrap"
                        >
                          <Download className="w-4 h-4" />
                          Download ZIP
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          onClick={handleConvert}
                          disabled={!canConvert}
                          className="gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <Spinner className="w-4 h-4" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              {settings.outputFormat === "webp" &&
                                "Convert to WebP"}
                              {settings.outputFormat === "avif" &&
                                "Convert to AVIF"}
                              {settings.outputFormat === "both" &&
                                "Convert to WebP + AVIF"}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {fileResults && showCompletedState && (
              <FileResultsTable results={fileResults} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
